"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "Tests that a Function Declaration doesn't have certain variables.",
            category: "",
            recommended: false
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [
            // fill in your schema
        ]
    },

    create: function(context) {

        var functions = {};
        var latestCodePath;

        // Node
        // -> Context
        // -> Maybe String
        function getForbiddenVariable(node, context) {
            if (node.type.indexOf("FunctionDeclaration") !== -1) {

                var code = context.getSourceCode();
                var comments = code.getComments(node);

                if (comments.leading.length > 0) {
                    var c = comments.leading.reduce(function(comment, line) {
                        comment += line.value.trim();
                        return comment;
                    }, '');

                    if (c.indexOf('forbid:') >= 0) {
                        return c.replace('forbid:', '').trim();
                    }
                    
                } 
            }
        }

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        return {

            "onCodePathStart": function(codePath, node) {
                
                var forbidden = getForbiddenVariable(node, context);

                // This code path is a function and it has a type
                // signature in the comment
                if (forbidden) {

                    latestCodePath = codePath.id;

                    // Save the function information in a state
                    // variable
                    functions[codePath.id] = {
                        functionName : node.id.name,
                        codePath: codePath,
                        node : node,
                        forbidden : forbidden
                    };
                }
            },

            "onCodePathEnd": function(codePath, node) {
                // Code path has ended, remove the code path
                // from the state
                functions[codePath.id] = undefined;
                latestCodePath = undefined;
            },

            // Selectors
            // https://eslint.org/docs/developer-guide/selectors
            "FunctionDeclaration Identifier": function(node) {

                if (latestCodePath != null) {

                    var code = context.getSourceCode();
                    var text = code.getText(node);

                    if (latestCodePath != null) {
                        // We know this node is inside a Function Declaration
                        // with a forbidden variable
    
                        var details = functions[latestCodePath];
                        
                        if (node.name === details.forbidden) {
                            context.report(
                                node,
                                'Function contains forbidden variable "' + details.forbidden + '"'
                            );
                        }
                    }
                }
            }
        };
    }
};
