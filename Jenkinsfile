pipeline {
    agent any
    
    tools{
        nodejs "NodeJS"
    }
    stages {
        
        stage('Cloning Repo') {
            steps {
                checkout scm
            }
        }

        stage('Running Tests'){
            steps {
                sh 'npm install'
                sh 'npm run test'
            }
        }
    }
}