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

        stage('Configuring Node'){
            steps {
                sh 'npm install'
            }
        }

        stage('Run test'){
            steps {
                sh 'npm run test'
            }
        }

        stage("Report Results") {
            steps {
                publishHTML([
                        allowMissing: false,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'report',
                        reportFiles: 'ApiTesting.html',
                        reportName: 'Mocha tests results',
                        reportTitles: ''])
            }
        }
    }
}