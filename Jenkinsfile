pipeline {
    agent any

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

        stage('Test') {
            steps {
                sh 'npm run test'
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
                sh 'docker logout' || true
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
