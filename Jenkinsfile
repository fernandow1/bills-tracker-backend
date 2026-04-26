pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    environment {
        NODE_ENV = 'test'
        DOCKERHUB_CREDENTIALS_ID = 'dockerhub-credentials'
        IMAGE_NAME = 'ferdog96/bills-tracker-backend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }        

        stage('Security Analysis') {
            parallel {
                stage('SCA & Secret Scanning (NPM)') {
                    steps {
                        sh '''
                            echo "Ejecutando escaneo de vulnerabilidades nativo..."
                            npm audit --audit-level=high || true
                            
                            echo "Ejecutando escaneo de secretos expuestos..."
                            npx -y @secretlint/quick-start --maskSecrets "**/*" || true
                        '''
                    }
                }
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Prettier') {
            steps {
                sh 'npx prettier --check "src/**/*.{ts,js,json}"'
            }
        }

        stage('Test Unit') {
            steps {
                sh '''
                    npm run test:unit -- \
                        --runInBand \
                        --watchAll=false \
                        --forceExit \
                        --testPathIgnorePatterns="integration"
                '''
            }
        }

        stage('Test Integration') {
            steps {
                script {
                    try {
                        sh 'docker volume rm bills-tracker_db_test_data || true'
                        sh 'docker compose -p bills-tracker --profile testing up -d db-test'
                        

                        withEnv([
                            'TEST_DB_HOST=bills-tracker-db-test', 
                            'TEST_DB_PORT=3306',
                            'MYSQLHOST=bills-tracker-db-test',
                            'MYSQLPORT=3306',
                            'MYSQLUSER=testuser',
                            'MYSQLPASSWORD=testpass',
                            'MYSQLDATABASE=bills_tracker_test'
                        ]) {
                            
                            sh '''
                                echo "Esperando a que db-test inicie y acepte conexiones TCP..."
                                for i in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do
                                    if docker exec bills-tracker-db-test mysqladmin ping -h 127.0.0.1 --protocol=tcp -u root -ptestroot --silent; then
                                        echo "✅ MySQL db-test inicializado y escuchando TCP en puerto 3306!"
                                        break
                                    fi
                                    echo "⏳ Aún no está listo, esperando 5s... ($i/20)"
                                    sleep 5
                                done
                                # Magen extra amplio de seguridad
                                sleep 5
                            '''
                            sh 'npm run test:migration:run'
                            sh 'npm run test:integration'
                        }
                    } finally {                        
                        sh 'docker compose -p bills-tracker --profile testing rm -fsv db-test || true'
                    }
                }
            }
        }

        stage('Build Project') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Docker Build and Push') {
            when {
                anyOf {
                    branch 'main'
                    branch 'development'
                }
            }
            steps {
                script {
                    def imageTag = ''
                    if (env.BRANCH_NAME == 'main') {
                        imageTag = 'latest'
                    } else if (env.BRANCH_NAME == 'development') {
                        imageTag = 'dev'
                    }

                    // Construimos la etiqueta corta de commit para trazarlo mejor
                    def commitSha = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()

                    withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDENTIALS_ID, passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                        sh "echo \$DOCKER_PASSWORD | docker login -u \$DOCKER_USERNAME --password-stdin"
                        
                        sh "docker build -t ${env.IMAGE_NAME}:${commitSha} -f Dockerfile --target production ."
                        sh "docker push ${env.IMAGE_NAME}:${commitSha}"
                        
                        if (imageTag != '') {
                            sh "docker tag ${env.IMAGE_NAME}:${commitSha} ${env.IMAGE_NAME}:${imageTag}"
                            sh "docker push ${env.IMAGE_NAME}:${imageTag}"
                        }
                    }
                }
            }
        }

        stage('Deploy to VPS (Production)') {
            when {
                branch 'main'
            }
            steps {
                script {
                    def projectDir = '~/bills-tracker-prod'
                    
                    withCredentials([
                        string(credentialsId: 'vps-ip', variable: 'VPS_IP'),
                        string(credentialsId: 'vps-user', variable: 'VPS_USER'),
                        string(credentialsId: 'cloudflare-tunnel-token', variable: 'CF_TUNNEL_TOKEN')
                    ]) {
                        sshagent(['vps-ssh-key']) {
                            // 1. Preparar el directorio, asegurar permisos y limpiar archivos viejos
                            sh """
                                ssh -o StrictHostKeyChecking=no \$VPS_USER@\$VPS_IP '
                                    mkdir -p ${projectDir} &&
                                    # Intentamos asegurar que el usuario sea dueño de todo (por si Docker cambió algo)
                                    sudo chown -R \$USER:\$USER ${projectDir} || true
                                    chmod -R u+w ${projectDir} || true
                                    # Borramos carpeta nginx y archivos de config para un deploy limpio
                                    cd ${projectDir} && rm -rf nginx docker-compose.prod.yml .env
                                '
                            """

                            // 2. Copiar archivos de configuración usando SCP
                            sh "scp -o StrictHostKeyChecking=no docker-compose.prod.yml \$VPS_USER@\$VPS_IP:${projectDir}/"
                            sh "scp -o StrictHostKeyChecking=no -r nginx \$VPS_USER@\$VPS_IP:${projectDir}/"
                            
                            // 3. Subir el archivo .env seguro desde Jenkins Secret File
                            withCredentials([file(credentialsId: 'env', variable: 'SECRET_ENV_FILE')]) {
                                sh "scp -o StrictHostKeyChecking=no \$SECRET_ENV_FILE \$VPS_USER@\$VPS_IP:${projectDir}/.env"
                            }
                            
                            // 3.1 Asegurar permisos del .env e inyectar el token de Cloudflare
                            sh """
                                ssh -o StrictHostKeyChecking=no \$VPS_USER@\$VPS_IP \"
                                    chmod 600 ${projectDir}/.env || true
                                    echo '' >> ${projectDir}/.env
                                    echo CLOUDFLARE_TUNNEL_TOKEN=\$CF_TUNNEL_TOKEN >> ${projectDir}/.env
                                \"
                            """
                            
                            // 3.2 Subir el template de Nginx seguro desde Jenkins Secret File
                            withCredentials([file(credentialsId: 'nginx-template', variable: 'NGINX_TEMPLATE_FILE')]) {
                                sh "ssh -o StrictHostKeyChecking=no \$VPS_USER@\$VPS_IP 'mkdir -p ${projectDir}/nginx/templates'"
                                sh "scp -o StrictHostKeyChecking=no \$NGINX_TEMPLATE_FILE \$VPS_USER@\$VPS_IP:${projectDir}/nginx/templates/default.conf.template.prod"
                            }
                            
                            // 4. Descargar nueva imagen, levantar producción y limpiar imágenes viejas
                            sh """
                                ssh -o StrictHostKeyChecking=no \$VPS_USER@\$VPS_IP '
                                    cd ${projectDir} &&
                                    rm -f nginx/templates/*.example &&
                                    docker compose -f docker-compose.prod.yml pull &&
                                    docker compose -f docker-compose.prod.yml up -d &&
                                    docker image prune -f
                                '
                            """
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            // Limpia recursos del workspace cuando termina, opcional pero buena practica
            cleanWs()
            
            script {
                // Logout de docker 
                sh 'docker logout || true'
            }
        }
        success {
            echo 'Pipeline completado exitosamente.'
        }
        failure {
            echo 'Error en el pipeline.'
        }
    }
}
