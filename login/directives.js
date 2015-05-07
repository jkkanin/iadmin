/**
 * Created with JetBrains WebStorm.
 * User: cwr.HVenkatachalam
 * Date: 7/17/13
 * Time: 7:02 AM
 * To change this template use File | Settings | File Templates.
 */

'use strict';

angular.module('login').directive("passwordInfo", [
    function () {
        return {
            restrict : "A",
            replace : false,
            link : function (scope, element, attrs) {
                $(element).keyup(function() {
                    // set password variable
                    var pswd = $(this).val();
                    //validates the length
                    if ( pswd.length < 8 ) {
                        $('#length').removeClass('valid').addClass('invalid');
                    } else {
                        $('#length').removeClass('invalid').addClass('valid');
                    }

                    //validate letter
                    if ( pswd.match(/[A-z]/) ) {
                        $('#letter').removeClass('invalid').addClass('valid');
                    } else {
                        $('#letter').removeClass('valid').addClass('invalid');
                    }

                    //validate capital letter
                    if ( pswd.match(/[A-Z]/) ) {
                        $('#capital').removeClass('invalid').addClass('valid');
                    } else {
                        $('#capital').removeClass('valid').addClass('invalid');
                    }

                    //validate number
                    if ( pswd.match(/\d/) ) {
                        $('#number').removeClass('invalid').addClass('valid');
                    } else {
                        $('#number').removeClass('valid').addClass('invalid');
                    }
                }).focus(function() {
                        $('#pswd_info').show();
                    }).blur(function() {
                        $('#pswd_info').hide();
                    });
            }
        }
    }]);