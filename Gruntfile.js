// Generated on 2015-03-17 using generator-angular 0.10.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    src: 'scr',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.src %>/app.js',
          '<%= yeoman.src %>/**/*.js'
        ]
      }
    },

    clean: {
      build: ['<%= yeoman.dist %>'],
      buildTemp: ['temp']
    },

    jsbeautifier: {
      all: {
        src: ['Gruntfile.js', '<%= yeoman.src %>/app.js', '<%= yeoman.src %>/**/*.js'],
        options: {
          config: '.jsbeautifyrc'
        }
      }
    },

    concat: {
      options: {
        separator: ';\n',
      },
      dist: {
        src: [
          'temp/app.js',
          'temp/config/**/*.js',
          'temp/services/**/*.js',
          'temp/directives/**/*.js'
        ],
        dest: '<%= yeoman.dist %>/leseulsteve-user-auth.js',
      },
    },

    uglify: {
      build: {
        options: {
          mangle: true,
          compress: true,
          sourceMap: true,
          preserveComments: false
        },
        files: {
          '<%= yeoman.dist %>/leseulsteve-user-auth.min.js': '<%= yeoman.dist %>/leseulsteve-user-auth.js',
        }
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      build: {
        files: [{
          expand: true,
          cwd: 'src',
          src: ['**/*.js'],
          dest: 'temp'
        }]
      }
    },

    autoprefixer: {
      dist: {
        files: {
          'dist/leseulsteve-user-auth.css': 'src/css/user-auth.css'
        }
      }
    },

    cssmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'dist',
          src: ['*.css', '!*.min.css'],
          dest: 'dist',
          ext: '.min.css'
        }]
      }
    }
  });

  grunt.registerTask('build', [
    'clean:build',
    'jshint:all',
    'jsbeautifier:all',
    'ngAnnotate:build',
    'concat',
    'uglify:build',
    'autoprefixer:dist',
    'cssmin:dist',
    'clean:buildTemp'
  ]);
};
