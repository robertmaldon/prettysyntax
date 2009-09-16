/* Copyright 2009 Robert Maldon
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. 
*/

function PrettySyntax() {
}

PrettySyntax.javaKeywords = ['abstract', 'boolean', 'break', 'byte', 'case', 'catch',
    'char', 'class', 'continue', 'default', 'do', 'double', 'else', 'extends',
    'false', 'finally', 'final', 'float', 'for', 'if', 'implements', 'import',
    'instanceof', 'interface', 'int', 'long', 'new', 'null', 'package',
    'private', 'protected', 'public', 'return', 'short', 'static', 'super',
    'switch', 'synchronized', 'this', 'throws', 'throw', 'transient', 'try',
    'true', 'void', 'while'];

PrettySyntax.javaOperators = ['==', '!=', '>=', '<=', '=', '<<', '>>', '>>>', '>', '<',
    '~', '++', '+', '--', '-', '*', '/', '%', '!', '&&', '&', '^', '||', '|',
    '?'];

PrettySyntax.javascriptKeywords = ['break', 'catch', 'const', 'continue', 'delete',
    'do', 'export', 'for', 'function', 'import', 'in', 'instanceOf', 'label',
    'let', 'new', 'null', 'return', 'switch', 'this', 'throw', 'try', 'typeof',
    'var', 'void', 'while', 'with', 'yield'];

PrettySyntax.javascriptOperators = ['===', '==', '!==', '!=', '>=', '<=', '^=', '=',
    '<<', '>>', '>>>', '>', '<', '~', '++', '+', '--', '-', '*', '/', '%', '!',
    '&&', '&', '^', '||', '|', '?'];

PrettySyntax.rubyKeywords = ['alias', 'and', 'BEGIN', 'begin', 'break', 'case', 'class',
    'def', 'defined?', 'do', 'else', 'elsif', 'END', 'end', 'ensure', 'false',
    'for', 'if', 'in', 'module', 'next', 'nil', 'not', 'or', 'private', 'redo',
    'rescue', 'require', 'retry', 'return', 'self', 'super', 'then', 'true',
    'undef', 'unless', 'until', 'when', 'while', 'yield'];

PrettySyntax.rubyOperators = ['[', ']=', ']', '>>', '<<', '<=', '>=', '<=>', '=>',
    '<', '>', '^', '===', '==', '!=', '=~', '!~', '!', '~', '+=', '+', '-=',
    '-', '**=', '**', '*=', '*', '/=', '/', '%=', '%', '&&=', '&&', '&=', '&',
    '||=', '||', '|=', '|', '=', '{', '}', '?', ':'];

PrettySyntax.railsKeywords = PrettySyntax.rubyKeywords.concat(['after_filter', 'before_filter', 'caches_action', 'layout', 'render']);

PrettySyntax.railsOperators = PrettySyntax.rubyOperators;

PrettySyntax.setClassName = function (obj, className) {
    if (obj.getAttribute('class')) {
        obj.setAttribute('class', className);
    } else {
        obj.className = className;
    }
}

PrettySyntax.getClassName = function(obj) {
    if (obj.getAttribute('class')) {
        return obj.getAttribute('class');
    } else {
        return obj.className;
    }
}

PrettySyntax.insertAfter = function(newElement, referenceElement) {
    var parent = referenceElement.parentNode;
    parent.insertBefore(newElement, referenceElement.nextSibling);
}

PrettySyntax.entityEscape = function (textin) {
    var textout = textin;
    textout = textout.replace(/\&/g, '&amp;');
    textout = textout.replace(/\</g, '&lt;');
    textout = textout.replace(/\>/g, '&gt;');
    return textout
}

PrettySyntax.highlightStringDoubleQuote = function(text) {
    return text.replace(/(.*)(\"[^\"]*\")(.*)/g,
           function(sOrg, s0, s1, s2) {
               s0 = PrettySyntax.highlightStringDoubleQuote(s0);
               s1 = "_PRETTYDOUBLEQUOTE" + PrettySyntax.entityEscape(s1) + "PRETTYDOUBLEQUOTE_";
               s2 = PrettySyntax.highlightStringDoubleQuote(s2);
               return s0 + s1 + s2;
            });
}

PrettySyntax.highlightStringSingleQuote = function(text) {
    return text.replace(/(.*)(\'[^\']*\')(.*)/g,
           function(sOrg, s0, s1, s2) {
               s0 = PrettySyntax.highlightStringSingleQuote(s0);
               s1 = "_PRETTYSINGLEQUOTE" + PrettySyntax.entityEscape(s1) + "PRETTYSINGLEQUOTE_";
               s2 = PrettySyntax.highlightStringSingleQuote(s2);
               return s0 + s1 + s2;
            });
}

PrettySyntax.highlightCode = function(keywords, operators, attachNode, text, insideMultiLineComment) {
    // Insert a carriage return every 75 characters
    //text = text.replace(/(.{75})/g, '$1' + 'PRETTYCR');
        
    if (!insideMultiLineComment) {
        var endOfLineComment = '';

        // Match start of multi-line comments
        if (text.match(/(.*)\/\*(.*)/)) {
            text = RegExp.$1;
            endOfLineComment = '_PRETTYCOMMENT' + '/*' + RegExp.$2 + 'PRETTYCOMMENT_';
            insideMultiLineComment = true;
        } else {
            // Match single-line comments
            if (text.match(/(.*)(\s+)\/\/(.*)/)) {
                text = RegExp.$1;
                endOfLineComment = RegExp.$2 + '_PRETTYCOMMENT' + '//' + RegExp.$3 + 'PRETTYCOMMENT_';
            }
            if (text.match(/^#(.*)/)) {
                text = '';
                endOfLineComment = '_PRETTYCOMMENT' + '#' + RegExp.$1 + 'PRETTYCOMMENT_';
            } else if (text.match(/^(\s+)#(.*)/)) {
                text = RegExp.$1;
                endOfLineComment = '_PRETTYCOMMENT' + '#' + RegExp.$2 + 'PRETTYCOMMENT_';
            }
        }

        // IE strips leading spaces, so we have to subsitute each leading space
        // space with a non-breaking space... gggrrr...
        text = text.replace(/(^\s+)(.*)/g, function(sOrg, s1, s2) {
            return s1.replace(/\s/g, '&nbsp;') + s2;
        });

        // Highlight keywords
        for (var i = 0; i < keywords.length; ++i) {
            var re = RegExp('\\b' + keywords[i] + '\\b', 'g');
            text = text.replace(re, '_PRETTYKEYWORD' + keywords[i] + 'PRETTYKEYWORD_');
        }

        // Highlight operators
        for (var i = 0; i < operators.length; ++i) {
            var op = '';
            for (var j = 0; j < operators[i].length; ++j) {
                op = op + '\\' + operators[i].charAt(j);
            }
            var re = RegExp('(\\s+)' + op + '(\\s+)', 'g');
            text = text.replace(re, '$1' + '_PRETTYOPERATOR' + operators[i] + 'PRETTYOPERATOR_' + '$2');
        }

        // Highlight literal strings
        text = PrettySyntax.highlightStringDoubleQuote(text);
        text = PrettySyntax.highlightStringSingleQuote(text);

        text = text + endOfLineComment;

        // Replace tokens
        text = text.replace(/PRETTYKEYWORD_/g, '</span>');
        text = text.replace(/_PRETTYKEYWORD/g, '<span class="prettykeyword">');
        text = text.replace(/PRETTYOPERATOR_/g, '</span>');
        text = text.replace(/_PRETTYOPERATOR/g, '<span class="prettyoperator">');
        text = text.replace(/PRETTYDOUBLEQUOTE_/g, '</span>');        
        text = text.replace(/_PRETTYDOUBLEQUOTE/g, '<span class="prettyliteral">');
        text = text.replace(/PRETTYSINGLEQUOTE_/g, '</span>');        
        text = text.replace(/_PRETTYSINGLEQUOTE/g, '<span class="prettyliteral">');
    } else {
        // IE strips leading spaces, so we have to subsitute each leading space
        // space with a non-breaking space... gggrrr...
        text = text.replace(/(^\s+)(.*)/g, function(sOrg, s1, s2) {
            return s1.replace(/\s/g, '&nbsp;') + s2;
        });

        // Match end of multi-line comment
        if (text.match(/(.*)\*\/(.*)/)) {
            text = '_PRETTYCOMMENT*/' + RegExp.$1 + 'PRETTYCOMMENT_' + RegExp.$2;
            insideMultiLineComment = false;
        } else {
            var matchTag = /<(?:.|\s)*?>/g; // Strip HTML inside multi-line comments - can cause display issues
            text = text.replace(matchTag, '');
            text = '_PRETTYCOMMENT' + text + 'PRETTYCOMMENT_';
        }
    }

    text = text.replace(/PRETTYCR/g, '&crarr;<br/>');
    text = text.replace(/PRETTYCOMMENT_/g, '</span>');        
    text = text.replace(/_PRETTYCOMMENT/g, '<span class="prettycomment">');

    attachNode.innerHTML = text + '\n';

    return insideMultiLineComment;
}

PrettySyntax.highlightCSSProperties = function(text) {
    text = text.replace(/(\W*)([\w|-]+)(\s*)\:(\s*\S+\;*)/g, '$1' + '_PRETTYPROPERTY' + '$2' + 'PRETTYPROPERTY_' + '$3:$4');
    return text;
}

PrettySyntax.highlightCSS = function(attachNode, text, insideProperties) {
    // Insert a carriage return every 75 characters
    //text = text.replace(/(.{75})/g, '$1' + 'PRETTYCR');
    
    var endOfLineComment = '';
    // Match single-line comments
    if (text.match(/(.*)(\s+)\/\*(.*)\*\/(.*)/)) {
        text = RegExp.$1;
        endOfLineComment = RegExp.$2 + '_PRETTYCOMMENT' + '/*' + RegExp.$3 + '*/' + 'PRETTYCOMMENT_' + RegExp.$4;
    } else if (text.match(/(\s*)\/\*(.*)\*\/(.*)/)) {
        text = '';
        endOfLineComment = RegExp.$1 + '_PRETTYCOMMENT' + '/*' + RegExp.$2 + '*/' + 'PRETTYCOMMENT_' + RegExp.$3;
    } else if (text.match(/(.*)(\s+)\/\/(.*)/)) {
        text = RegExp.$1;
        endOfLineComment = RegExp.$2 + '_PRETTYCOMMENT' + '//' + RegExp.$3 + 'PRETTYCOMMENT_';
    } else if (text.match(/(\s*)\/\/(.*)/)) {
        text = '';
        endOfLineComment = RegExp.$1 + '_PRETTYCOMMENT' + '//' + RegExp.$2 + 'PRETTYCOMMENT_';
    }

    if (insideProperties) {
        if (text.match(/(.*)\}(.*)/)) {
            text = PrettySyntax.highlightCSSProperties(RegExp.$1) + '}' + RegExp.$2;
            insideProperties = false;
        } else {
            text = PrettySyntax.highlightCSSProperties(text);
        }
    } else if (text.match(/(.*)\{(.*)\}(.*)/)) {
        var selectors = RegExp.$1;
        var properties = RegExp.$2;
        var endOfLine = RegExp.$3;

        selectors = selectors.replace(/(\s*)(\.\w+)(\s*)/, '$1' + '_PRETTYSELECTORCLASS' + '$2' + 'PRETTYSELECTORCLASS_' + '$3');
        selectors = selectors.replace(/(\s*)(\#\w+)(\s*)/, '$1' + '_PRETTYSELECTORID' + '$2' + 'PRETTYSELECTORID_' + '$3');

        text = selectors + '{' + PrettySyntax.highlightCSSProperties(properties) + '}' + endOfLine;
    } else if (text.match(/(.*)\{(.*)/)) {
        var selectors = RegExp.$1;
        var properties = RegExp.$2;

        selectors = selectors.replace(/(\s*)(\.\w+)(\s*)/, '$1' + '_PRETTYSELECTORCLASS' + '$2' + 'PRETTYSELECTORCLASS_' + '$3');
        selectors = selectors.replace(/(\s*)(\#\w+)(\s*)/, '$1' + '_PRETTYSELECTORID' + '$2' + 'PRETTYSELECTORID_' + '$3');

        text = selectors + '{' + PrettySyntax.highlightCSSProperties(properties);

        insideProperties = true;
    }

    text = text + endOfLineComment;

    text = text.replace(/PRETTYCR/g, '&crarr;<br/>');
    text = text.replace(/PRETTYSELECTORCLASS_/g, '</span>');        
    text = text.replace(/_PRETTYSELECTORCLASS/g, '<span class="prettyselectorclass">');
    text = text.replace(/PRETTYSELECTORID_/g, '</span>');        
    text = text.replace(/_PRETTYSELECTORID/g, '<span class="prettyselectorid">');
    text = text.replace(/PRETTYPROPERTY_/g, '</span>');        
    text = text.replace(/_PRETTYPROPERTY/g, '<span class="prettyproperty">');
    text = text.replace(/PRETTYCOMMENT_/g, '</span>');        
    text = text.replace(/_PRETTYCOMMENT/g, '<span class="prettycomment">');

    // IE strips leading spaces, so we have to subsitute each leading space
    // space with a non-breaking space... gggrrr...
    text = text.replace(/(^\s+)(.*)/g, function(sOrg, s1, s2) {
               return s1.replace(/\s/g, '&nbsp;') + s2;
           });

    attachNode.innerHTML = text + '\n';

    return insideProperties;
}

PrettySyntax.rawTextPopup = function(rawText) {
    var popup = window.open("", "_blank", "width=750, height=500, resizable=yes, scrollbars=yes, menubar=yes");
    popup.document.open('text/plain');
    popup.document.write(rawText);
    popup.document.close();
    return popup;
}

PrettySyntax.main = function() {
    var allPreElements = document.getElementsByTagName('pre');
    for (var i = 0; i < allPreElements.length; ++i) {
        var pre = allPreElements[i];
        if (pre.getAttribute('name') != 'code') {
            continue;
        }

        var keywords = [];
        var operators = [];
        var prettyClass = PrettySyntax.getClassName(pre);
        switch (prettyClass) {
            case 'java' :
                keywords = PrettySyntax.javaKeywords;
                operators = PrettySyntax.javaOperators;
                break;
            case 'javascript' :
                keywords = PrettySyntax.javascriptKeywords;
                operators = PrettySyntax.javascriptOperators;
                break;
            case 'rails' :
                keywords = PrettySyntax.railsKeywords;
                operators = PrettySyntax.railsOperators;
                break;
            case 'ruby' :
                keywords = PrettySyntax.rubyKeywords;
                operators = PrettySyntax.rubyOperators;
                break;
            default:
                break;
        }

        PrettySyntax.setClassName(pre, 'prettycode');

        var text = '';
        // Firefox will often (but not always) break up child nodes into 4096
        // characters long, so here we combine all the children... gggrrr...
        for (var j = 0; j < pre.childNodes.length; ++j) {
            text = text + pre.childNodes[j].nodeValue;
        }
        text = text.replace(/^\s+|\s+$/g, ''); // Trim leading and trailing whitespace
        text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n'); // Account for different newlines on UNIX and Windows

        // Copy context of pre element line by line into an ordered list

        var list = document.createElement('ol');
        PrettySyntax.setClassName(list, 'prettylist');

        var insideMultiLineComment = false;
        var insideProperties = false;

        var lines = text.split('\n');
        for (var k = 0; k < lines.length; ++k) {
            var li = document.createElement('li');
            PrettySyntax.setClassName(li, (k % 2) ? 'prettyeven' : 'prettyodd');
            if (prettyClass == 'css') {
                insideProperties = PrettySyntax.highlightCSS(li, lines[k], insideProperties);
            } else {
                insideMultiLineComment = PrettySyntax.highlightCode(keywords, operators, li, lines[k], insideMultiLineComment);
            }
            list.appendChild(li);
        }
        PrettySyntax.insertAfter(list, pre);

        // Create some useful functions

        var funcs = document.createElement('div');
        PrettySyntax.setClassName(funcs, 'prettyfuncs');
        list.appendChild(funcs);

        // View Raw
        var viewRaw = document.createElement('a');
        viewRaw.setAttribute('href', '#');
        viewRaw.innerHTML = 'view raw';
        viewRaw.rawText = text;
        viewRaw.onclick = function() { 
            PrettySyntax.rawTextPopup(this.rawText);
            return false;
        }
        funcs.appendChild(viewRaw);

        // Print Raw
        var printRaw = document.createElement('a');
        printRaw.setAttribute('href', '#');
        printRaw.innerHTML = 'print raw';
        printRaw.rawText = text;
        printRaw.onclick = function() { 
            PrettySyntax.rawTextPopup(this.rawText).print();
            return false;
        }
        funcs.appendChild(printRaw);

        // Copy Raw
        if (window.clipboardData && clipboardData.setData) { // Only works in IE
            var copyRaw = document.createElement('a');
            copyRaw.setAttribute('href', '#');
            copyRaw.innerHTML = 'copy raw';
            copyRaw.rawText = text;
            copyRaw.onclick = function() {
                clipboardData.setData("Text", this.rawText.replace(/\n/g, '\r\n'));
                alert('Code is now on the clipboard');
                return false;
            }
            funcs.appendChild(copyRaw);
        }
    }
}

// If you include PrettySyntax in your page header instead of the footer then
// you have to hook into the page onload event like so:
//
// if (window.addEventListener) {
//     window.addEventListener('load', PrettySyntax.main, false);
// } else if (window.attachEvent) {
//     window.attachEvent('onload', PrettySyntax.main);
// }

// Prettyify any code
PrettySyntax.main();
