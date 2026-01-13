pipeline {
    agent any

    environment {
        IMAGE_NAME = "02psg/kanban-board-image"
        TAG = "latest"
    }

    stages {
        stage('Clone Code') {
            steps {
                git 'https://github.com/02psg/kanban-board-k8s.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t $IMAGE_NAME:$TAG ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    docker push $IMAGE_NAME:$TAG
                    """
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh "kubectl apply -f Deployment.yaml"
                sh "kubectl apply -f Service.yaml"
                sh "kubectl apply -f ingress.yaml"
            }
        }
    }
}

