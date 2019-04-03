/**
 * @fileoverview Tests that a function doesn't use a certain variable
 * @author Dominick Gendill
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/forbidden-variable.js"),
    fs = require('fs'),
    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("forbidden-variable", rule, {

    valid: [
        {
            code: fs.readFileSync(__dirname + '/test-code/forbidden-variable-ok.js', 'utf-8')
        }
    ],

    invalid: [
        {
            code: fs.readFileSync(__dirname + '/test-code/forbidden-variable-error.js', 'utf-8'),
            errors: [{
                message: "Function contains forbidden variable \"voldemort\"",
                type: "Identifier"
            }]
        }
    ]
});
