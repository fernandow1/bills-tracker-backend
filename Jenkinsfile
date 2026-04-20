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
                                for i in {1..20}; do
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

        stage('Deploy to Railway (Production)') {
            when {
                branch 'main'
            }
            steps {
                withCredentials([string(credentialsId: 'railway-token', variable: 'RAILWAY_TOKEN')]) {
                    sh '''
                        echo "Instalando Railway CLI..."
                        npm install -g @railway/cli
                        
                        echo "Desplegando la aplicación en Railway..."
                        railway up --service grateful-acceptance --detach
                    '''
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
