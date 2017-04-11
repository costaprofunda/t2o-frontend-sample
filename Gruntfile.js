module.exports = function (grunt) {

    grunt.initConfig({
        app: 't2oApp',
        dist: 'dist',
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: [
                "<%= dist %>",
                '.tmp'
            ],
            release: [
                //"<%= dist %>/resources",
                "<%= dist %>/**/*.js",
                "<%= dist %>/**/*.css",
                "!<%= dist %>/resources/js/*.t2o.min.js",
                "!<%= dist %>/resources/css/*.t2o.min.css"
            ]
        },
        copy: {
            main: {
                expand: true,
                cwd: '<%= app %>/',
                src: ['**'],
                dest: '<%= dist %>/'
            },
            afterFonts: {
                expand: true,
                flatten: true,
                src: ['bower_components/bootstrap/fonts/**', 'bower_components/font-awesome/fonts/**', '<%= app %>/resources/fonts/**'],
                dest: '<%= dist %>/resources/fonts/'
            },
            afterChosenImages: {
                expand: true,
                cwd: 'bower_components/chosen/',
                src: ['*.png'],
                dest: '<%= dist %>/resources/css'
            },
            afterLeafletImages: {
                expand: true,
                cwd: 'bower_components/leaflet/dist/images/',
                src: ['*.png'],
                dest: '<%= dist %>/resources/css'
            }

        },
        removelogging: {
            dist: {
                src: '<%= dist %>/**/*.js'
            }
        },
        rev: {
            files: {
                src: ['<%= dist %>/**/*.{js,css}']
            }
        },
        useminPrepare: {
            html: '<%= dist %>/index.html',
            options: {
                dest: '<%= dist %>'
            }
        },
        usemin: {
            html: ['<%= dist %>/index.html'],
            options: {
                dest: '<%= dist %>'
            }
        },
        uglify: {
            options: {
                report: 'min',
                mangle: false,
                booleans: false,
                drop_console: true
            }
        },
        ngconstant: {
            // Options for all targets
            options: {
                wrap: '\'use strict\';\n\n {%= __ngModule %}',
                dest: '<%= dist %>/core/constants/env.js',
                name: 't2oFrontendCore',
                deps: false
            },
            // Environment targets
            development: {
                constants: {
                    Env: {
                        name: 'development',
                        apiUrl: 'http://t2o-backend.intricity.com',
                        socketUrl: 'ws://t2o-backend.intricity.com/ws/',
                        version: '<%= pkg.version %>',
                        templates: grunt.file.expand({filter: "isFile", cwd: "t2oApp"}, ["**/*.html"])
                    }
                }
            }

        },
        'file-creator': {
            env: {
                't2oApp/core/constants/env.js': function (fs, fd, done) {
                    fs.writeSync(fd, "'use strict';\n");
                    fs.writeSync(fd, "angular.module('sdocsFrontendCore').constant('Env', {name: '', apiUrl: '', socketUrl: '', version: '', templates: ''});");
                    done();
                }
            }
        },
        googlefonts: {
            build: {
                options: {
                    fontPath: '<%= app %>/resources/fonts/',
                    cssFile: '<%= app %>/resources/css/fonts.css',
                    fonts: [
                        {
                            family: 'Open Sans',
                            styles: [
                                300, 400, 700
                            ]
                        }
                    ]
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);
    grunt.registerTask('build_master', [
        'clean:build',
        'copy:main',
        'ngconstant:production',
        'removelogging',
        'useminPrepare',
        'concat',
        'uglify',
        'cssmin',
        'rev',
        'usemin',
        'clean:release',
        'copy:afterFonts',
        'copy:afterChosenImages',
        'copy:afterLeafletImages'
    ]);
    grunt.registerTask('build_dev', [
        'clean:build',
        'copy:main',
        'ngconstant:development',
        //'removelogging',
        'useminPrepare',
        'concat',
        'uglify',
        'cssmin',
        'rev',
        'usemin',
        'clean:release',
        'copy:afterFonts',
        'copy:afterChosenImages',
        'copy:afterLeafletImages'
    ]);
    grunt.registerTask('default', [
        'file-creator',
        //'jasmine',
        'build_master'
        //'e2e_test'
    ]);
    grunt.registerTask('deploy_test', [
        'file-creator',
        //'jasmine',
        'build_dev'
        //'e2e_test'
    ]);
};