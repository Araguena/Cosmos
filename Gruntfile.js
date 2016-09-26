module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: [
                    'public/js/components/*.js' // Все JS в папке libs
                ],
                dest: 'public/js/main.js'
            }
        },
        uglify: {
            build: {
                src: 'public/js/main.js',
                dest: 'public/js/main.min.js'
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'public/styles/main.css': 'public/styles/scss/main.scss'
                }
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions']
            },
            single_file: {
                src: 'public/styles/main.css',
                dest: 'public/styles/main.css'
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');

    grunt.registerTask('default', ['concat', 'uglify', 'sass', 'autoprefixer']);

};