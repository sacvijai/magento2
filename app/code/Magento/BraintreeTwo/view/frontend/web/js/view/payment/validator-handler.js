/**
 * Copyright © 2015 Magento. All rightsreserved.
 * See COPYING.txt for license details.
 */
/*browser:true*/
/*global define*/

define([
    'jquery',
    'Magento_Ui/js/model/messageList',
    'Magento_BraintreeTwo/js/view/payment/3d-secure'
], function ($, globalMessageList, verify3DSecure) {
    'use strict';

    return {
        validators: [],

        /**
         * Init list of validators
         */
        initialize: function () {
            this.add(verify3DSecure);
        },

        /**
         * Add new validator
         * @param {Object} validator
         */
        add: function (validator) {
            this.validators.push(validator);
        },

        /**
         * Run pull of validators
         * @param {Object} context
         * @param {Function} callback
         */
        validate: function (context, callback) {
            var self = this,
                deferred;

            // no available validators
            if (!self.validators.length) {
                callback();
            }

            // get list of deferred validators
            deferred = $.map(self.validators, function (current) {
                return current.validate(context);
            });

            $.when.apply($, deferred)
                .done(function () {
                    callback();
                }).fail(function (error) {
                    self.showError(error);
                });
        },

        /**
         * Show error message
         * @param {String} errorMessage
         */
        showError: function (errorMessage) {
            globalMessageList.addErrorMessage({
                message: errorMessage
            });
        }
    };
});
