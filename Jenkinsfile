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
                        // Levantamos unicamente la base de datos de pruebas bajo el profile testing
                        sh 'docker compose --profile testing up -d db-test'
                        
                        // Esperamos a que mysql termine su arranque antes de interactuar
                        sh 'sleep 15'
                        
                        // Ejecutamos migraciones en test y luego los integration tests
                        sh 'npm run test:migration:run'
                        sh 'npm run test:integration'
                    } finally {
                        // Limpiamos y matamos el contenedor asi halla fallado el script
                        sh 'docker compose --profile testing rm -fsv db-test || true'
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
                        
                        def img = docker.build("${env.IMAGE_NAME}:${commitSha}", "-f Dockerfile --target production .")
                        
                        img.push()
                        
                        if (imageTag != '') {
                            img.push(imageTag)
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
