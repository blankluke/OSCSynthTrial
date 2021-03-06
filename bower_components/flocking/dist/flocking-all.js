/*! Flocking 0.1.0 (July 16, 2014), Copyright 2014 Colin Clark | flockingjs.org */

/*!
 * jQuery JavaScript Library v2.0.0
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-04-18
 */
(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// A central reference to the root jQuery(document)
	rootjQuery,

	// The deferred used on DOM ready
	readyList,

	// Support: IE9
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "2.0.0",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler and self cleanup method
	completed = function() {
		document.removeEventListener( "DOMContentLoaded", completed, false );
		window.removeEventListener( "load", completed, false );
		jQuery.ready();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		// Support: Safari <= 5.1 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Support: Firefox <20
		// The try/catch suppresses exceptions thrown when attempting to access
		// the "constructor" property of certain host objects, ie. |window.location|
		// https://bugzilla.mozilla.org/show_bug.cgi?id=814622
		try {
			if ( obj.constructor &&
					!core_hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
				return false;
			}
		} catch ( e ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );

		if ( scripts ) {
			jQuery( scripts ).remove();
		}

		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: JSON.parse,

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}

		// Support: IE9
		try {
			tmp = new DOMParser();
			xml = tmp.parseFromString( data , "text/xml" );
		} catch ( e ) {
			xml = undefined;
		}

		if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
				indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {
			// Otherwise, avoid the DOM node creation, insertion
			// and removal by using an indirect global eval
				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	trim: function( text ) {
		return text == null ? "" : core_trim.call( text );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : core_indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: Date.now,

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.9.2-pre
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-04-16
 */
(function( window, undefined ) {

var i,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	support = {},
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function() { return 0; },

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Array methods
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"boolean": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = /\\([\da-fA-F]{1,6}[\x20\t\r\n\f]?|.)/g,
	funescape = function( _, escaped ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		return high !== high ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

/**
 * For feature detection
 * @param {Function} fn The function to test for native support
 */
function isNative( fn ) {
	return rnative.test( fn + "" );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var cache,
		keys = [];

	return (cache = function( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	});
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
	// Detached nodes confoundingly follow *each other*
	support.sortDetached = assert(function( div1 ) {
		// Should return 1, but returns 4 (following)
		return div1.compareDocumentPosition( document.createElement("div") ) & 1;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// Support: Windows 8 Native Apps
	// Assigning innerHTML with "name" attributes throws uncatchable exceptions
	// (http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx)
	// and the broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );

				return m ?
					m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
						[m] :
						undefined :
					[];
			}
		};
		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = isNative(doc.querySelectorAll)) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = document.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = isNative( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = isNative(docElem.contains) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	// rbuggyQSA always contains :focus, so no need for an existence check
	if ( support.matchesSelector && documentIsHTML &&
		(!rbuggyMatches || !rbuggyMatches.test(expr)) &&
		(!rbuggyQSA     || !rbuggyQSA.test(expr)) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		val = fn && fn( elem, name, !documentIsHTML );

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns Returns -1 if a precedes b, 1 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && ( ~b.sourceIndex || MAX_NEGATIVE ) - ( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

// Fetches boolean attributes by node
function boolHandler( elem, name, isXML ) {
	var val;
	return isXML ?
		undefined :
		(val = elem.getAttributeNode( name )) && val.specified ?
			val.value :
			elem[ name ] === true ? name.toLowerCase() : null;
}

// Fetches attributes without interpolation
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
function interpolationHandler( elem, name, isXML ) {
	var val;
	return isXML ?
		undefined :
		(val = elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 ));
}

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[4] ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector( tokens.slice( 0, i - 1 ) ).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}

				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Initialize against the default document
setDocument();

// Support: Chrome<<14
// Always assume duplicates if they aren't passed to the comparison function
[0, 0].sort( sortOrder );
support.detectDuplicates = hasDuplicate;

// Support: IE<8
// Prevent attribute/property "interpolation"
assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	if ( div.firstChild.getAttribute("href") !== "#" ) {
		var attrs = "type|href|height|width".split("|"),
			i = attrs.length;
		while ( i-- ) {
			Expr.attrHandle[ attrs[i] ] = interpolationHandler;
		}
	}
});

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
assert(function( div ) {
	if ( div.getAttribute("disabled") != null ) {
		var attrs = booleans.split("|"),
			i = attrs.length;
		while ( i-- ) {
			Expr.attrHandle[ attrs[i] ] = boolHandler;
		}
	}
});

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {
	var input = document.createElement("input"),
		fragment = document.createDocumentFragment(),
		div = document.createElement("div"),
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") );

	// Finish early in limited environments
	if ( !input.type ) {
		return support;
	}

	input.type = "checkbox";

	// Support: Safari 5.1, iOS 5.1, Android 4.x, Android 2.3
	// Check the default checkbox/radio value ("" on old WebKit; "on" elsewhere)
	support.checkOn = input.value !== "";

	// Must access the parent to make an option select properly
	// Support: IE9, IE10
	support.optSelected = opt.selected;

	// Will be defined later
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;
	support.pixelPosition = false;

	// Make sure checked status is properly cloned
	// Support: IE9, IE10
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Check if an input maintains its value after becoming a radio
	// Support: IE9, IE10
	input = document.createElement("input");
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment.appendChild( input );

	// Support: Safari 5.1, Android 4.x, Android 2.3
	// old WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: Firefox, Chrome, Safari
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	support.focusinBubbles = "onfocusin" in window;

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv,
			// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
			divReset = "padding:0;margin:0;border:0;display:block;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box",
			body = document.getElementsByTagName("body")[ 0 ];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		// Check box-sizing and margin behavior.
		body.appendChild( container ).appendChild( div );
		div.innerHTML = "";
		// Support: Firefox, Android 2.3 (Prefixed box-sizing versions).
		div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Support: Android 2.3
			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		body.removeChild( container );
	});

	return support;
})( {} );

/*
	Implementation Summary

	1. Enforce API surface and semantic compatibility with 1.9.x branch
	2. Improve the module's maintainability by reducing the storage
		paths to a single mechanism.
	3. Use the same single mechanism to support "private" and "user" data.
	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
	5. Avoid exposing implementation details on user objects (eg. expando properties)
	6. Provide a clear path for implementation upgrade to WeakMap in 2014
*/
var data_user, data_priv,
	rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function Data() {
	// Support: Android < 4,
	// Old WebKit does not have Object.preventExtensions/freeze method,
	// return new empty object instead with no [[set]] accessor
	Object.defineProperty( this.cache = {}, 0, {
		get: function() {
			return {};
		}
	});

	this.expando = jQuery.expando + Math.random();
}

Data.uid = 1;

Data.accepts = function( owner ) {
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType ?
		owner.nodeType === 1 || owner.nodeType === 9 : true;
};

Data.prototype = {
	key: function( owner ) {
		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return the key for a frozen object.
		if ( !Data.accepts( owner ) ) {
			return 0;
		}

		var descriptor = {},
			// Check if the owner object already has a cache key
			unlock = owner[ this.expando ];

		// If not, create one
		if ( !unlock ) {
			unlock = Data.uid++;

			// Secure it in a non-enumerable, non-writable property
			try {
				descriptor[ this.expando ] = { value: unlock };
				Object.defineProperties( owner, descriptor );

			// Support: Android < 4
			// Fallback to a less secure definition
			} catch ( e ) {
				descriptor[ this.expando ] = unlock;
				jQuery.extend( owner, descriptor );
			}
		}

		// Ensure the cache object
		if ( !this.cache[ unlock ] ) {
			this.cache[ unlock ] = {};
		}

		return unlock;
	},
	set: function( owner, data, value ) {
		var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this "owner", create one inline
			// and set the unlock as though an owner entry had always existed
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {
			// Support an expectation from the old data system where plain
			// objects used to initialize would be set to the cache by
			// reference, instead of having properties and values copied.
			// Note, this will kill the connection between
			// "this.cache[ unlock ]" and "cache"
			if ( jQuery.isEmptyObject( cache ) ) {
				this.cache[ unlock ] = data;
			// Otherwise, copy the properties one-by-one to the cache object
			} else {
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
		}
	},
	get: function( owner, key ) {
		// Either a valid cache is found, or will be created.
		// New caches will be created and the unlock returned,
		// allowing direct access to the newly created
		// empty data object. A valid owner object must be provided.
		var cache = this.cache[ this.key( owner ) ];

		return key === undefined ?
			cache : cache[ key ];
	},
	access: function( owner, key, value ) {
		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				((key && typeof key === "string") && value === undefined) ) {
			return this.get( owner, key );
		}

		// [*]When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name,
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		if ( key === undefined ) {
			this.cache[ unlock ] = {};

		} else {
			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key ];
				} else {
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = jQuery.camelCase( key );
					name = name in cache ?
						[ name ] : ( name.match( core_rnotwhite ) || [] );
				}
			}

			i = name.length;
			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}
	},
	hasData: function( owner ) {
		return !jQuery.isEmptyObject(
			this.cache[ owner[ this.expando ] ] || {}
		);
	},
	discard: function( owner ) {
		delete this.cache[ this.key( owner ) ];
	}
};

// These may be used throughout the jQuery core codebase
data_user = new Data();
data_priv = new Data();


jQuery.extend({
	acceptData: Data.accepts,

	hasData: function( elem ) {
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return data_user.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		data_user.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to data_priv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return data_priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		data_priv.remove( elem, name );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			elem = this[ 0 ],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = data_user.get( elem );

				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[ i ].name;

						if ( name.indexOf( "data-" ) === 0 ) {
							name = jQuery.camelCase( name.substring(5) );
							dataAttr( elem, name, data[ name ] );
						}
					}
					data_priv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				data_user.set( this, key );
			});
		}

		return jQuery.access( this, function( value ) {
			var data,
				camelKey = jQuery.camelCase( key );

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {
				// Attempt to get data from the cache
				// with the key as-is
				data = data_user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to get data from the cache
				// with the key camelized
				data = data_user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each(function() {
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = data_user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				data_user.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf("-") !== -1 && data !== undefined ) {
					data_user.set( this, key, value );
				}
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			data_user.remove( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? JSON.parse( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			data_user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = data_priv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		hooks.cur = fn;
		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button)$/i;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each(function() {
			delete this[ jQuery.propFix[ name ] || name ];
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					data_priv.set( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE6-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.boolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.boolean.test( name ) ) {
					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
					elem.tabIndex :
					-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.boolean.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = function( elem, name, isXML ) {
		var fn = jQuery.expr.attrHandle[ name ],
			ret = isXML ?
				undefined :
				/* jshint eqeqeq: false */
				// Temporarily disable this handler to check existence
				(jQuery.expr.attrHandle[ name ] = undefined) !=
					getter( elem, name, isXML ) ?

					name.toLowerCase() :
					null;

		// Restore handler
		jQuery.expr.attrHandle[ name ] = fn;

		return ret;
	};
});

// Support: IE9+
// Selectedness for an option in an optgroup can be inaccurate
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.hasData( elem ) && data_priv.get( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;
			data_priv.remove( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Safari 6.0+, Chrome < 28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && e.preventDefault ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// Create "bubbling" focus and blur events
// Support: Firefox, Chrome, Safari
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var self, matched, i,
			l = this.length;

		if ( typeof selector !== "string" ) {
			self = this;
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		matched = [];
		for ( i = 0; i < l; i++ ) {
			jQuery.find( selector, this[ i ], matched );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		matched = this.pushStack( l > 1 ? jQuery.unique( matched ) : matched );
		matched.selector = ( this.selector ? this.selector + " " : "" ) + selector;
		return matched;
	},

	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter(function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[ 0 ] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = ( rneedsContext.test( selectors ) || typeof selectors !== "string" ) ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return core_indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return core_indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.unique( matched );
			}

			// Reverse order for parents* and prev*
			if ( name[ 0 ] === "p" ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( core_indexOf.call( qualifier, elem ) >= 0 ) !== not;
	});
}
var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {

		// Support: IE 9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

// Support: IE 9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.col = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[ 0 ] && this[ 0 ].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							// Support: QtWebKit
							// jQuery.merge because core_push.apply(_, arraylike) throws
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because core_push.apply(_, arraylike) throws
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Support: IE >= 9
		// Fix Cloning issues
		if ( !jQuery.support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) && !jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
			i = 0,
			l = elems.length,
			fragment = context.createDocumentFragment(),
			nodes = [];

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					// Support: QtWebKit
					// jQuery.merge because core_push.apply(_, arraylike) throws
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.firstChild;
					}

					// Support: QtWebKit
					// jQuery.merge because core_push.apply(_, arraylike) throws
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Fixes #12346
					// Support: Webkit, IE
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			l = elems.length,
			i = 0,
			special = jQuery.event.special;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( jQuery.acceptData( elem ) ) {

				data = data_priv.access( elem );

				if ( data ) {
					for ( type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						// This is a shortcut to avoid jQuery.event.remove's overhead
						} else {
							jQuery.removeEvent( elem, type, data.handle );
						}
					}
				}
			}
			// Discard any remaining `private` and `user` data
			// One day we'll replace the dual arrays with a WeakMap and this won't be an issue.
			// (Splices the data objects out of the internal cache arrays)
			data_user.discard( elem );
			data_priv.discard( elem );
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "text",
			async: false,
			global: false,
			success: jQuery.globalEval
		});
	}
});

// Support: 1.x compatibility
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var l = elems.length,
		i = 0;

	for ( ; i < l; i++ ) {
		data_priv.set(
			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
		);
	}
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( data_priv.hasData( src ) ) {
		pdataOld = data_priv.access( src );
		pdataCur = jQuery.extend( {}, pdataOld );
		events = pdataOld.events;

		data_priv.set( dest, pdataCur );

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( data_user.hasData( src ) ) {
		udataOld = data_user.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		data_user.set( dest, udataCur );
	}
}


function getAll( context, tag ) {
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

// Support: IE >= 9
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}
jQuery.fn.extend({
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var curCSS, iframe,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
function getStyles( elem ) {
	return window.getComputedStyle( elem, null );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = data_priv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = data_priv.access( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css(elem, "display") );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		var bool = typeof state === "boolean";

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifying setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

curCSS = function( elem, name, _computed ) {
	var width, minWidth, maxWidth,
		computed = _computed || getStyles( elem ),

		// Support: IE9
		// getPropertyValue is only needed for .css('filter') in IE9, see #12537
		ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
		style = elem.style;

	if ( computed ) {

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: Safari 5.1
		// A tribute to the "awesome hack by Dean Edwards"
		// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret;
};


function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	// Support: Android 2.3
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// Support: Android 2.3
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,
			// URL without anti-cache param
			cacheURL,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {
	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery("<script>").prop({
					async: true,
					charset: s.scriptCharset,
					src: s.url
				}).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
jQuery.ajaxSettings.xhr = function() {
	try {
		return new XMLHttpRequest();
	} catch( e ) {}
};

var xhrSupported = jQuery.ajaxSettings.xhr(),
	xhrSuccessStatus = {
		// file protocol always yields status code 0, assume 200
		0: 200,
		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	// Support: IE9
	// We need to keep track of outbound xhr and abort them manually
	// because IE is not smart enough to do it all by itself
	xhrId = 0,
	xhrCallbacks = {};

if ( window.ActiveXObject ) {
	jQuery( window ).on( "unload", function() {
		for( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]();
		}
		xhrCallbacks = undefined;
	});
}

jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
jQuery.support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport(function( options ) {
	var callback;
	// Cross domain only allowed if supported through XMLHttpRequest
	if ( jQuery.support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i, id,
					xhr = options.xhr();
				xhr.open( options.type, options.url, options.async, options.username, options.password );
				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}
				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}
				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
					headers["X-Requested-With"] = "XMLHttpRequest";
				}
				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}
				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							delete xhrCallbacks[ id ];
							callback = xhr.onload = xhr.onerror = null;
							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {
								complete(
									// file protocol always yields status 0, assume 404
									xhr.status || 404,
									xhr.statusText
								);
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,
									// Support: IE9
									// #11426: When requesting binary data, IE9 will throw an exception
									// on any attempt to access responseText
									typeof xhr.responseText === "string" ? {
										text: xhr.responseText
									} : undefined,
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};
				// Listen to events
				xhr.onload = callback();
				xhr.onerror = callback("error");
				// Create the abort callback
				callback = xhrCallbacks[( id = xhrId++ )] = callback("abort");
				// Do send the request
				// This may raise an exception which is actually
				// handled in jQuery.ajax (so no try/catch here)
				xhr.send( options.hasContent && options.data || null );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1,
				maxIterations = 20;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" && start ) {
					// Iteratively approximate from a nonzero starting point
					// Prefer the current property, because this process will be trivial if it uses the same units
					// Fallback to end or a simple constant
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*
						// Use a string for doubling factor so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur()
					// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				tween.unit = unit;
				tween.start = start;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {

				// we're done with this property
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var index, prop, value, length, dataShow, toggle, tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always(function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		});
	}


	// show/hide pass
	dataShow = data_priv.get( elem, "fxshow" );
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if( value === "show" && dataShow !== undefined && dataShow[ index ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = data_priv.get( elem, "fxshow" ) || data_priv.access( elem, "fxshow", {} );
		if ( "hidden" in dataShow ) {
			hidden = dataShow.hidden;
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;

			data_priv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );
				doAnimation.finish = function() {
					anim.stop( true );
				};
				// Empty animations, or finishing resolves immediately
				if ( empty || data_priv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = data_priv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = data_priv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.cur && hooks.cur.finish ) {
				hooks.cur.finish.call( this );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		elem = this[ 0 ],
		box = { top: 0, left: 0 },
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top + win.pageYOffset - docElem.clientTop,
		left: box.left + win.pageXOffset - docElem.clientLeft
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) && ( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

		// Need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// We assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : window.pageXOffset,
					top ? val : window.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

// If there is a window object, that at least has a document property,
// define jQuery and $ identifiers
if ( typeof window === "object" && typeof window.document === "object" ) {
	window.jQuery = window.$ = jQuery;
}

})( window );
;/*!
 * Fluid Infusion v1.5
 *
 * Infusion is distributed under the Educational Community License 2.0 and new BSD licenses:
 * http://wiki.fluidproject.org/display/fluid/Fluid+Licensing
 *
 * For information on copyright, see the individual Infusion source code files:
 * https://github.com/fluid-project/infusion/
 */
/*
Copyright 2007-2010 University of Cambridge
Copyright 2007-2009 University of Toronto
Copyright 2007-2009 University of California, Berkeley
Copyright 2010-2011 Lucendo Development Ltd.
Copyright 2010 OCAD University
Copyright 2011 Charly Molter

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

// Declare dependencies
/* global console, opera, YAHOO*/

var fluid_1_5 = fluid_1_5 || {};
var fluid = fluid || fluid_1_5;

(function ($, fluid) {
    "use strict";

    fluid.version = "Infusion 1.5";

    // Export this for use in environments like node.js, where it is useful for
    // configuring stack trace behaviour
    fluid.Error = Error;

    fluid.environment = {
        fluid: fluid
    };

    var globalObject = window || {};

    // The following flag defeats all logging/tracing activities in the most performance-critical parts of the framework.
    // This should really be performed by a build-time step which eliminates calls to pushActivity/popActivity and fluid.log.
    fluid.defeatLogging = true;

    // This flag enables the accumulating of all "activity" records generated by pushActivity into a running trace, rather
    // than removing them from the stack record permanently when receiving popActivity. This trace will be consumed by
    // visual debugging tools.
    fluid.activityTracing = false;
    fluid.activityTrace = [];

    var activityParser = /(%\w+)/g;

    // Renders a single activity element in a form suitable to be sent to a modern browser's console
    // unsupported, non-API function
    fluid.renderOneActivity = function (activity, nowhile) {
        var togo = nowhile === true ? [] : ["    while "];
        var message = activity.message;
        var index = activityParser.lastIndex = 0;
        while (true) {
            var match = activityParser.exec(message);
            if (match) {
                var key = match[1].substring(1);
                togo.push(message.substring(index, match.index));
                togo.push(activity.args[key]);
                index = activityParser.lastIndex;
            }
            else {
                break;
            }
        }
        if (index < message.length) {
            togo.push(message.substring(index));
        }
        return togo;
    };

    // Renders an activity stack in a form suitable to be sent to a modern browser's console
    // unsupported, non-API function
    fluid.renderActivity = function (activityStack, renderer) {
        renderer = renderer || fluid.renderOneActivity;
        return fluid.transform(activityStack, renderer);
    };

    // Return an array of objects describing the current activity
    // unsupported, non-API function
    fluid.getActivityStack = function () {
        var root = fluid.globalThreadLocal();
        if (!root.activityStack) {
            root.activityStack = [];
        }
        return root.activityStack;
    };

    // Return an array of objects describing the current activity
    // unsupported, non-API function
    fluid.describeActivity = fluid.getActivityStack;

    // Renders either the current activity or the supplied activity to the console
    fluid.logActivity = function (activity) {
        activity = activity || fluid.describeActivity();
        var rendered = fluid.renderActivity(activity).reverse();
        fluid.log("Current activity: ");
        fluid.each(rendered, function (args) {
            fluid.doLog(args);
        });
    };

    // Execute the supplied function with the specified activity description pushed onto the stack
    // unsupported, non-API function
    fluid.pushActivity = function (type, message, args) {
        var record = {type: type, message: message, args: args, time: new Date().getTime()};
        if (fluid.activityTracing) {
            fluid.activityTrace.push(record);
        }
        if (fluid.passLogLevel(fluid.logLevel.TRACE)) {
            fluid.doLog(fluid.renderOneActivity(record, true));
        }
        var activityStack = fluid.getActivityStack();
        activityStack.push(record);
    };

    // Undo the effect of the most recent pushActivity, or multiple frames if an argument is supplied
    fluid.popActivity = function (popframes) {
        popframes = popframes || 1;
        if (fluid.activityTracing) {
            fluid.activityTrace.push({pop: popframes});
        }
        var activityStack = fluid.getActivityStack();
        var popped = activityStack.length - popframes;
        activityStack.length = popped < 0 ? 0 : popped;
    };
    // "this-ist" style Error so that we can distinguish framework errors whilst still retaining access to platform Error features
    // unsupported, non-API function
    fluid.FluidError = function (message) {
        this.message = message;
        this.stack = new Error().stack;
    };
    fluid.FluidError.prototype = new Error();

    // The framework's built-in "fail" policy, in case a user-defined handler would like to
    // defer to it
    fluid.builtinFail = function (soft, args, activity) {
        fluid.log.apply(null, [fluid.logLevel.FAIL, "ASSERTION FAILED: "].concat(args));
        fluid.logActivity(activity);
        var message = args.join("");
        if (soft) {
            throw new fluid.FluidError(message);
        } else {
            message["Assertion failure - check console for details"](); // Intentionally cause a browser error by invoking a nonexistent function.
        }
    };

    var softFailure = [false];

    /**
     * Signals an error to the framework. The default behaviour is to log a structured error message and throw a variety of
     * exception (hard or soft) - see fluid.pushSoftFailure for configuration
     *
     * @param {String} message the error message to log
     * @param ... Additional arguments, suitable for being sent to native console.log function
     */
    fluid.fail = function (/* message, ... */) {
        var args = fluid.makeArray(arguments);
        var activity = fluid.makeArray(fluid.describeActivity()); // Take copy since we will destructively modify
        fluid.popActivity(activity.length);
        var topFailure = softFailure[0];
        if (typeof(topFailure) === "boolean") {
            fluid.builtinFail(topFailure, args, activity);
        } else if (typeof(topFailure) === "function") {
            topFailure(args, activity);
        }
    };

    /**
     * Configure the behaviour of fluid.fail by pushing or popping a disposition record onto a stack.
     * @param {Boolean|Number|Function} condition
     & Supply either a boolean flag choosing between built-in framework strategies to be used in fluid.fail
     * - <code>false</code>, the default causes a "hard failure" by using a nonexistent property on a String, which
     * will in all known environments trigger an unhandleable exception which aids debugging. The boolean value
     * <code>true</code> downgrades this behaviour to throw a conventional exception, which is more appropriate in
     * test cases which need to demonstrate failure, as well as in some production environments.
     * The argument may also be a function, which will be called with two arguments, args (the complete arguments to
     * fluid.fail) and activity, an array of strings describing the current framework invocation state.
     * Finally, the argument may be the number <code>-1</code> indicating that the previously supplied disposition should
     * be popped off the stack
     */
    fluid.pushSoftFailure = function (condition) {
        if (typeof (condition) === "boolean" || typeof (condition) === "function") {
            softFailure.unshift(condition);
        } else if (condition === -1) {
            softFailure.shift();
        }
    };

    fluid.notrycatch = true;

    // A wrapper for the try/catch/finally language feature, to aid debugging on environments
    // such as IE, where any try will destroy stack information for errors
    // TODO: The only non-deprecated call to this annoying utility is left in DataBinding.js to deal with
    // cleanup in source tracking. We should really review whether we mean to abolish all exception handling
    // code throughout the framework - on several considerations this is desirable.
    fluid.tryCatch = function (tryfun, catchfun, finallyfun) {
        finallyfun = finallyfun || fluid.identity;
        if (fluid.notrycatch) {
            var togo = tryfun();
            finallyfun();
            return togo;
        } else {
            try {
                return tryfun();
            } catch (e) {
                if (catchfun) {
                    catchfun(e);
                } else {
                    throw (e);
                }
            } finally {
                finallyfun();
            }
        }
    };

    // TODO: rescued from kettleCouchDB.js - clean up in time
    fluid.expect = function (name, members, target) {
        fluid.transform(fluid.makeArray(members), function (key) {
            if (typeof target[key] === "undefined") {
                fluid.fail(name + " missing required parameter " + key);
            }
        });
    };

    // Logging

    /** Returns whether logging is enabled **/
    fluid.isLogging = function () {
        return logLevelStack[0].priority > fluid.logLevel.IMPORTANT.priority;
    };

    /** Determines whether the supplied argument is a valid logLevel marker **/
    fluid.isLogLevel = function (arg) {
        return fluid.isMarker(arg) && arg.priority !== undefined;
    };

    /** Accepts one of the members of the <code>fluid.logLevel</code> structure. Returns <code>true</code> if
     *  a message supplied at that log priority would be accepted at the current logging level. Clients who
     *  issue particularly expensive log payload arguments are recommended to guard their logging statements with this
     *  function */

    fluid.passLogLevel = function (testLogLevel) {
        return testLogLevel.priority <= logLevelStack[0].priority;
    };

    /** Method to allow user to control the logging level. Accepts either a boolean, for which <code>true</code>
      * represents <code>fluid.logLevel.INFO</code> and <code>false</code> represents <code>fluid.logLevel.IMPORTANT</code> (the default),
      * or else any other member of the structure <code>fluid.logLevel</code>
      * Messages whose priority is strictly less than the current logging level will not be shown*/
    fluid.setLogging = function (enabled) {
        var logLevel;
        if (typeof enabled === "boolean") {
            logLevel = fluid.logLevel[enabled? "INFO" : "IMPORTANT"];
        } else if (fluid.isLogLevel(enabled)) {
            logLevel = enabled;
        } else {
            fluid.fail("Unrecognised fluid logging level ", enabled);
        }
        logLevelStack.unshift(logLevel);
    };

    fluid.setLogLevel = fluid.setLogging;

    /** Undo the effect of the most recent "setLogging", returning the logging system to its previous state **/
    fluid.popLogging = function () {
        return logLevelStack.length === 1? logLevelStack[0] : logLevelStack.shift();
    };

    /** Actually do the work of logging <code>args</code> to the environment's console. If the standard "console"
     * stream is available, the message will be sent there - otherwise either the
     * YAHOO logger or the Opera "postError" stream will be used. On capable environments (those other than
     * IE8 or IE9) the entire argument set will be dispatched to the logger - otherwise they will be flattened into
     * a string first, destroying any information held in non-primitive values.
     */
    fluid.doLog = function (args) {
        var str = args.join("");
        if (typeof (console) !== "undefined") {
            if (console.debug) {
                console.debug.apply(console, args);
            } else if (typeof (console.log) === "function") {
                console.log.apply(console, args);
            } else {
                console.log(str); // this branch executes on old IE, fully synthetic console.log
            }
        } else if (typeof (YAHOO) !== "undefined") {
            YAHOO.log(str);
        } else if (typeof (opera) !== "undefined") {
            opera.postError(str);
        }
    };

    /** Log a message to a suitable environmental console. If the first argument to fluid.log is
     * one of the members of the <code>fluid.logLevel</code> structure, this will be taken as the priority
     * of the logged message - else if will default to <code>fluid.logLevel.INFO</code>. If the logged message
     * priority does not exceed that set by the most recent call to the <code>fluid.setLogging</code> function,
     * the message will not appear.
     */
    fluid.log = function (/* message /*, ... */) {
        var directArgs = fluid.makeArray(arguments);
        var userLogLevel = fluid.logLevel.INFO;
        if (fluid.isLogLevel(directArgs[0])) {
            userLogLevel = directArgs.shift();
        }
        if (fluid.passLogLevel(userLogLevel)) {
            var arg0 = fluid.renderTimestamp(new Date()) + ":  ";
            var args = [arg0].concat(directArgs);
            fluid.doLog(args);
        }
    };

    // Functional programming utilities.

    /** A basic utility that returns its argument unchanged */

    fluid.identity = function (arg) {
        return arg;
    };

    // Framework and instantiation functions.


    /** Returns true if the argument is a value other than null or undefined **/
    fluid.isValue = function (value) {
        return value !== undefined && value !== null;
    };

    /** Returns true if the argument is a primitive type **/
    fluid.isPrimitive = function (value) {
        var valueType = typeof (value);
        return !value || valueType === "string" || valueType === "boolean" || valueType === "number" || valueType === "function";
    };

    /** Determines whether the supplied object is an array. The strategy used is an optimised
     * approach taken from an earlier version of jQuery - detecting whether the toString() version
     * of the object agrees with the textual form [object Array], or else whether the object is a
     * jQuery object (the most common source of "fake arrays").
     */
    fluid.isArrayable = function (totest) {
        return totest && (totest.jquery || Object.prototype.toString.call(totest) === "[object Array]");
    };

    /** Determines whether the supplied object is a plain JSON-forming container - that is, it is either a plain Object
     * or a plain Array */
    fluid.isPlainObject = function (totest) {
        if (!totest) {
            return false; // FLUID-5172 - on IE8 the line below produces [object Object] rather than [object Null] or [object Undefined]
        }
        var string = Object.prototype.toString.call(totest);
        return string === "[object Array]" || string === "[object Object]";
    };

    fluid.isDOMNode = function (obj) {
      // This could be more sound, but messy:
      // http://stackoverflow.com/questions/384286/javascript-isdom-how-do-you-check-if-a-javascript-object-is-a-dom-object
      // The real problem is browsers like IE6, 7 and 8 which still do not feature a "constructor" property on DOM nodes
        return obj && typeof (obj.nodeType) === "number";
    };

    fluid.isDOMish = function (obj) {
        return fluid.isDOMNode(obj) || obj.jquery;
    };

    fluid.isComponent = function (obj) {
        // TODO: improve this strategy in time - we may want to actually use a constructor-based test when we can drop IE8
        return obj && obj.typeName && obj.id;
    };

    /** Return an empty container as the same type as the argument (either an
     * array or hash */
    fluid.freshContainer = function (tocopy) {
        return fluid.isArrayable(tocopy) ? [] : {};
    };

    /** Performs a deep copy (clone) of its argument **/

    fluid.copy = function (tocopy) {
        if (fluid.isPrimitive(tocopy)) {
            return tocopy;
        }
        return $.extend(true, fluid.freshContainer(tocopy), tocopy);
    };

    /** Corrected version of jQuery makeArray that returns an empty array on undefined rather than crashing.
      * We don't deal with as many pathological cases as jQuery **/
    fluid.makeArray = function (arg) {
        var togo = [];
        if (arg !== null && arg !== undefined) {
            if (fluid.isPrimitive(arg) || typeof(arg.length) !== "number") {
                togo.push(arg);
            }
            else {
                for (var i = 0; i < arg.length; ++ i) {
                    togo[i] = arg[i];
                }
            }
        }
        return togo;
    };

    function transformInternal(source, togo, key, args) {
        var transit = source[key];
        for (var j = 0; j < args.length - 1; ++j) {
            transit = args[j + 1](transit, key);
        }
        togo[key] = transit;
    }

    /** Return a list or hash of objects, transformed by one or more functions. Similar to
     * jQuery.map, only will accept an arbitrary list of transformation functions and also
     * works on non-arrays.
     * @param source {Array or Object} The initial container of objects to be transformed.
     * @param fn1, fn2, etc. {Function} An arbitrary number of optional further arguments,
     * all of type Function, accepting the signature (object, index), where object is the
     * list member to be transformed, and index is its list index. Each function will be
     * applied in turn to each list member, which will be replaced by the return value
     * from the function.
     * @return The finally transformed list, where each member has been replaced by the
     * original member acted on by the function or functions.
     */
    fluid.transform = function (source) {
        var togo = fluid.freshContainer(source);
        if (fluid.isArrayable(source)) {
            for (var i = 0; i < source.length; ++i) {
                transformInternal(source, togo, i, arguments);
            }
        } else {
            for (var key in source) {
                transformInternal(source, togo, key, arguments);
            }
        }
        return togo;
    };

    /** Better jQuery.each which works on hashes as well as having the arguments
     * the right way round.
     * @param source {Arrayable or Object} The container to be iterated over
     * @param func {Function} A function accepting (value, key) for each iterated
     * object. This function may return a value to terminate the iteration
     */
    fluid.each = function (source, func) {
        if (fluid.isArrayable(source)) {
            for (var i = 0; i < source.length; ++i) {
                func(source[i], i);
            }
        } else {
            for (var key in source) {
                func(source[key], key);
            }
        }
    };

    fluid.make_find = function (find_if) {
        var target = find_if ? false : undefined;
        return function (source, func, deffolt) {
            var disp;
            if (fluid.isArrayable(source)) {
                for (var i = 0; i < source.length; ++i) {
                    disp = func(source[i], i);
                    if (disp !== target) {
                        return find_if ? source[i] : disp;
                    }
                }
            } else {
                for (var key in source) {
                    disp = func(source[key], key);
                    if (disp !== target) {
                        return find_if ? source[key] : disp;
                    }
                }
            }
            return deffolt;
        };
    };

    /** Scan through a list or hash of objects, terminating on the first member which
     * matches a predicate function.
     * @param source {Arrayable or Object} The list or hash of objects to be searched.
     * @param func {Function} A predicate function, acting on a member. A predicate which
     * returns any value which is not <code>undefined</code> will terminate
     * the search. The function accepts (object, index).
     * @param deflt {Object} A value to be returned in the case no predicate function matches
     * a list member. The default will be the natural value of <code>undefined</code>
     * @return The first return value from the predicate function which is not <code>undefined</code>
     */
    fluid.find = fluid.make_find(false);
    /** The same signature as fluid.find, only the return value is the actual element for which the
     * predicate returns a value different from <code>false</code>
     */
    fluid.find_if = fluid.make_find(true);

    /** Scan through a list of objects, "accumulating" a value over them
     * (may be a straightforward "sum" or some other chained computation). "accumulate" is the name derived
     * from the C++ STL, other names for this algorithm are "reduce" or "fold".
     * @param list {Array} The list of objects to be accumulated over.
     * @param fn {Function} An "accumulation function" accepting the signature (object, total, index) where
     * object is the list member, total is the "running total" object (which is the return value from the previous function),
     * and index is the index number.
     * @param arg {Object} The initial value for the "running total" object.
     * @return {Object} the final running total object as returned from the final invocation of the function on the last list member.
     */
    fluid.accumulate = function (list, fn, arg) {
        for (var i = 0; i < list.length; ++i) {
            arg = fn(list[i], arg, i);
        }
        return arg;
    };

    /** Scan through a list or hash of objects, removing those which match a predicate. Similar to
     * jQuery.grep, only acts on the list in-place by removal, rather than by creating
     * a new list by inclusion.
     * @param source {Array|Object} The list or hash of objects to be scanned over.
     * @param fn {Function} A predicate function determining whether an element should be
     * removed. This accepts the standard signature (object, index) and returns a "truthy"
     * result in order to determine that the supplied object should be removed from the list.
     * @param target {Array|Object} (optional) A target object of the same type as <code>source</code>, which will
     * receive any objects removed from it.
     * @return <code>target</code>, containing the removed elements, if it was supplied, or else <code>source</code>
     * modified by the operation of removing the matched elements.
     */
    fluid.remove_if = function (source, fn, target) {
        if (fluid.isArrayable(source)) {
            for (var i = 0; i < source.length; ++i) {
                if (fn(source[i], i)) {
                    if (target) {
                        target.push(source[i]);
                    }
                    source.splice(i, 1);
                    --i;
                }
            }
        } else {
            for (var key in source) {
                if (fn(source[key], key)) {
                    if (target) {
                        target[key] = source[key];
                    }
                    delete source[key];
                }
            }
        }
        return target || source;
    };

    /** Fills an array of given size with copies of a value or result of a function invocation
     * @param n {Number} The size of the array to be filled
     * @param generator {Object|Function} Either a value to be replicated or function to be called
     * @param applyFunc {Boolean} If true, treat the generator value as a function to be invoked with
     * argument equal to the index position
     */

    fluid.generate = function (n, generator, applyFunc) {
        var togo = [];
        for (var i = 0; i < n; ++ i) {
            togo[i] = applyFunc? generator(i) : generator;
        }
        return togo;
    };

    /** Returns an array of size count, filled with increasing integers, starting at 0 or at the index specified by first.
     * @param count {Number} Size of the filled array to be returned
     * @param first {Number} (optional, defaults to 0) First element to appear in the array
     */

    fluid.iota = function (count, first) {
        first = first || 0;
        var togo = [];
        for (var i = 0; i < count; ++i) {
            togo[togo.length] = first++;
        }
        return togo;
    };

    /** Extracts a particular member from each top-level member of a container, returning a new container of the same type
     * @param holder {Array|Object} The container to be filtered
     * @param name {String|Array of String} An EL path to be fetched from each top-level member
     */

    fluid.getMembers = function (holder, name) {
        return fluid.transform(holder, function(member) {
            return fluid.get(member, name);
        });
    };

    /** Accepts an object to be filtered, and a list of keys. Either all keys not present in
     * the list are removed, or only keys present in the list are returned.
     * @param toFilter {Array|Object} The object to be filtered - this will be modified by the operation
     * @param keys {Array of String} The list of keys to operate with
     * @param exclude {boolean} If <code>true</code>, the keys listed are removed rather than included
     * @return the filtered object (the same object that was supplied as <code>toFilter</code>
     */

    fluid.filterKeys = function (toFilter, keys, exclude) {
        return fluid.remove_if($.extend({}, toFilter), function (value, key) {
            return exclude ^ ($.inArray(key, keys) === -1);
        });
    };

    /** A convenience wrapper for <code>fluid.filterKeys</code> with the parameter <code>exclude</code> set to <code>true</code>
     *  Returns the supplied object with listed keys removed */

    fluid.censorKeys = function (toCensor, keys) {
        return fluid.filterKeys(toCensor, keys, true);
    };

    // TODO: This is not as clever an idea as we think it is - this typically inner-loop function will optimise badly due to closure
    fluid.makeFlatten = function (index) {
        return function (obj) {
            var togo = [];
            fluid.each(obj, function (/* value, key */) {
                togo.push(arguments[index]);
            });
            return togo;
        };
    };

    /** Return the keys in the supplied object as an array **/
    fluid.keys = fluid.makeFlatten(1);

    /** Return the values in the supplied object as an array **/
    fluid.values = fluid.makeFlatten(0);

    /**
     * Searches through the supplied object, and returns <code>true</code> if the supplied value
     * can be found
     */
    fluid.contains = function (obj, value) {
        return obj ? (fluid.isArrayable(obj) ? $.inArray(value, obj) !== -1 : fluid.find(obj, function (thisValue) {
            if (value === thisValue) {
                return true;
            }
        })) : undefined;
    };

    /**
     * Searches through the supplied object for the first value which matches the one supplied.
     * @param obj {Object} the Object to be searched through
     * @param value {Object} the value to be found. This will be compared against the object's
     * member using === equality.
     * @return {String} The first key whose value matches the one supplied, or <code>null</code> if no
     * such key is found.
     */
    fluid.keyForValue = function (obj, value) {
        return fluid.find(obj, function (thisValue, key) {
            if (value === thisValue) {
                return key;
            }
        });
    };

    /**
     * This method is now deprecated and will be removed in a future release of Infusion.
     * See fluid.keyForValue instead.
     */
    fluid.findKeyInObject = fluid.keyForValue;

    /** Converts an array into an object whose keys are the elements of the array, each with the value "true"
     */

    fluid.arrayToHash = function (array) {
        var togo = {};
        fluid.each(array, function (el) {
            togo[el] = true;
        });
        return togo;
    };

    /**
     * Clears an object or array of its contents. For objects, each property is deleted.
     *
     * @param {Object|Array} target the target to be cleared
     */
    fluid.clear = function (target) {
        if (fluid.isArrayable(target)) {
            target.length = 0;
        } else {
            for (var i in target) {
                delete target[i];
            }
        }
    };

   /**
    * @param boolean ascending <code>true</code> if a comparator is to be returned which
    * sorts strings in descending order of length
    */
    fluid.compareStringLength = function (ascending) {
        return ascending ? function (a, b) {
            return a.length - b.length;
        } : function (a, b) {
            return b.length - a.length;
        };
    };

    fluid.logLevelsSpec = {
        "FATAL":      0,
        "FAIL":       5,
        "WARN":      10,
        "IMPORTANT": 12, // The default logging "off" level - corresponds to the old "false"
        "INFO":      15, // The default logging "on" level - corresponds to the old "true"
        "TRACE":     20
    };

    /** A structure holding all supported log levels as supplied as a possible first argument to fluid.log
     * Members with a higher value of the "priority" field represent lower priority logging levels */
    // Moved down here since it uses fluid.transform on startup
    fluid.logLevel = fluid.transform(fluid.logLevelsSpec, function (value, key) {
        return {type: "fluid.marker", value: key, priority: value};
    });
    var logLevelStack = [fluid.logLevel.IMPORTANT]; // The stack of active logging levels, with the current level at index 0

    /** A set of special "marker values" used in signalling in function arguments and return values,
      * to partially compensate for JavaScript's lack of distinguished types. These should never appear
      * in JSON structures or other kinds of static configuration. An API specifically documents if it
      * accepts or returns any of these values, and if so, what its semantic is  - most are of private
      * use internal to the framework **/

    /** A special "marker object" representing that a distinguished
     * (probably context-dependent) value should be substituted.
     */
    fluid.VALUE = {type: "fluid.marker", value: "VALUE"};

    /** A special "marker object" representing that no value is present (where
     * signalling using the value "undefined" is not possible - e.g. the return value from a "strategy") */
    fluid.NO_VALUE = {type: "fluid.marker", value: "NO_VALUE"};

    /** A marker indicating that a value requires to be expanded after component construction begins **/
    fluid.EXPAND = {type: "fluid.marker", value: "EXPAND"};
    /** A marker indicating that a value requires to be expanded immediately **/
    fluid.EXPAND_NOW = {type: "fluid.marker", value: "EXPAND_NOW"};

    /** Determine whether an object is any marker, or a particular marker - omit the
     * 2nd argument to detect any marker
     */
    fluid.isMarker = function (totest, type) {
        if (!totest || typeof (totest) !== "object" || totest.type !== "fluid.marker") {
            return false;
        }
        if (!type) {
            return true;
        }
        return totest.value === type.value;
    };

    // Model functions
    fluid.model = {}; // cannot call registerNamespace yet since it depends on fluid.model

    /** Copy a source "model" onto a target **/
    fluid.model.copyModel = function (target, source) {
        fluid.clear(target);
        $.extend(true, target, source);
    };

    /** Parse an EL expression separated by periods (.) into its component segments.
     * @param {String} EL The EL expression to be split
     * @return {Array of String} the component path expressions.
     * TODO: This needs to be upgraded to handle (the same) escaping rules (as RSF), so that
     * path segments containing periods and backslashes etc. can be processed, and be harmonised
     * with the more complex implementations in fluid.pathUtil(data binding).
     */
    fluid.model.parseEL = function (EL) {
        return EL === "" ? [] : String(EL).split(".");
    };

    /** Compose an EL expression from two separate EL expressions. The returned
     * expression will be the one that will navigate the first expression, and then
     * the second, from the value reached by the first. Either prefix or suffix may be
     * the empty string **/

    fluid.model.composePath = function (prefix, suffix) {
        return prefix === "" ? suffix : (suffix === "" ? prefix : prefix + "." + suffix);
    };

    /** Compose any number of path segments, none of which may be empty **/
    fluid.model.composeSegments = function () {
        return fluid.makeArray(arguments).join(".");
    };

    /** Helpful alias for old-style API **/
    fluid.path = fluid.model.composeSegments;
    fluid.composePath = fluid.model.composePath;


    // unsupported, NON-API function
    fluid.requireDataBinding = function () {
        fluid.fail("Please include DataBinding.js in order to operate complex model accessor configuration");
    };

    fluid.model.setWithStrategy = fluid.model.getWithStrategy = fluid.requireDataBinding;

    // unsupported, NON-API function
    fluid.model.resolvePathSegment = function (root, segment, create, origEnv) {
        if (!origEnv && root.resolvePathSegment) {
            return root.resolvePathSegment(segment);
        }
        if (create && root[segment] === undefined) {
            // This optimisation in this heavily used function has a fair effect
            return root[segment] = {}; // jshint ignore:line
        }
        return root[segment];
    };

    // unsupported, NON-API function
    fluid.model.pathToSegments = function (EL, config) {
        var parser = config && config.parser ? config.parser.parse : fluid.model.parseEL;
        var segs = typeof(EL) === "number" || typeof(EL) === "string" ? parser(EL) : EL;
        return segs;
    };

    // Overall strategy skeleton for all implementations of fluid.get/set
    fluid.model.accessImpl = function (root, EL, newValue, config, initSegs, returnSegs, traverser) {
        var segs = fluid.model.pathToSegments(EL, config);
        var initPos = 0;
        if (initSegs) {
            initPos = initSegs.length;
            segs = initSegs.concat(segs);
        }
        var uncess = newValue === fluid.NO_VALUE ? 0 : 1;
        root = traverser(root, segs, initPos, config, uncess);
        if (newValue === fluid.NO_VALUE || newValue === fluid.VALUE) { // get or custom
            return returnSegs ? {root: root, segs: segs} : root;
        }
        else { // set
            root[segs[segs.length - 1]] = newValue;
        }
    };

    // unsupported, NON-API function
    fluid.model.accessSimple = function (root, EL, newValue, environment, initSegs, returnSegs) {
        return fluid.model.accessImpl(root, EL, newValue, environment, initSegs, returnSegs, fluid.model.traverseSimple);
    };

    // unsupported, NON-API function
    fluid.model.traverseSimple = function (root, segs, initPos, environment, uncess) {
        var origEnv = environment;
        var limit = segs.length - uncess;
        for (var i = 0; i < limit; ++i) {
            if (!root) {
                return root;
            }
            var segment = segs[i];
            if (environment && environment[segment]) {
                root = environment[segment];
            } else {
                root = fluid.model.resolvePathSegment(root, segment, uncess === 1, origEnv);
            }
            environment = null;
        }
        return root;
    };

    fluid.model.setSimple = function (root, EL, newValue, environment, initSegs) {
        fluid.model.accessSimple(root, EL, newValue, environment, initSegs, false);
    };

    /** Optimised version of fluid.get for uncustomised configurations **/

    fluid.model.getSimple = function (root, EL, environment, initSegs) {
        if (EL === null || EL === undefined || EL.length === 0) {
            return root;
        }
        return fluid.model.accessSimple(root, EL, fluid.NO_VALUE, environment, initSegs, false);
    };

    // unsupported, NON-API function
    // Returns undefined to signal complex configuration which needs to be farmed out to DataBinding.js
    // any other return represents an environment value AND a simple configuration we can handle here
    fluid.decodeAccessorArg = function (arg3) {
        return (!arg3 || arg3 === fluid.model.defaultGetConfig || arg3 === fluid.model.defaultSetConfig) ?
            null : (arg3.type === "environment" ? arg3.value : undefined);
    };

    fluid.set = function (root, EL, newValue, config, initSegs) {
        var env = fluid.decodeAccessorArg(config);
        if (env === undefined) {
            fluid.model.setWithStrategy(root, EL, newValue, config, initSegs);
        } else {
            fluid.model.setSimple(root, EL, newValue, env, initSegs);
        }
    };

    /** Evaluates an EL expression by fetching a dot-separated list of members
     * recursively from a provided root.
     * @param root The root data structure in which the EL expression is to be evaluated
     * @param {string/array} EL The EL expression to be evaluated, or an array of path segments
     * @param config An optional configuration or environment structure which can customise the fetch operation
     * @return The fetched data value.
     */

    fluid.get = function (root, EL, config, initSegs) {
        var env = fluid.decodeAccessorArg(config);
        return env === undefined ?
            fluid.model.getWithStrategy(root, EL, config, initSegs)
            : fluid.model.accessImpl(root, EL, fluid.NO_VALUE, env, null, false, fluid.model.traverseSimple);
    };

    // This backward compatibility will be maintained for a number of releases, probably until Fluid 2.0
    fluid.model.setBeanValue = fluid.set;
    fluid.model.getBeanValue = fluid.get;

    fluid.getGlobalValue = function (path, env) {
        if (path) {
            env = env || fluid.environment;
            return fluid.get(globalObject, path, {type: "environment", value: env});
        }
    };

    /**
     * Allows for the binding to a "this-ist" function
     * @param {Object} obj, "this-ist" object to bind to
     * @param {Object} fnName, the name of the function to call
     * @param {Object} args, arguments to call the function with
     */
    fluid.bind = function (obj, fnName, args) {
        return obj[fnName].apply(obj, fluid.makeArray(args));
    };

    /**
     * Allows for the calling of a function from an EL expression "functionPath", with the arguments "args", scoped to an framework version "environment".
     * @param {Object} functionPath - An EL expression
     * @param {Object} args - An array of arguments to be applied to the function, specified in functionPath
     * @param {Object} environment - (optional) The object to scope the functionPath to  (typically the framework root for version control)
     */
    fluid.invokeGlobalFunction = function (functionPath, args, environment) {
        var func = fluid.getGlobalValue(functionPath, environment);
        if (!func) {
            fluid.fail("Error invoking global function: " + functionPath + " could not be located");
        } else {
            // FLUID-4915: Fixes an issue for IE8 by defaulting to an empty array when args are falsey.
            return func.apply(null, args || []);
        }
    };

    /** Registers a new global function at a given path (currently assumes that
     * it lies within the fluid namespace)
     */

    fluid.registerGlobalFunction = function (functionPath, func, env) {
        env = env || fluid.environment;
        fluid.set(globalObject, functionPath, func, {type: "environment", value: env});
    };

    fluid.setGlobalValue = fluid.registerGlobalFunction;

    /** Ensures that an entry in the global namespace exists **/
    fluid.registerNamespace = function (naimspace, env) {
        env = env || fluid.environment;
        var existing = fluid.getGlobalValue(naimspace, env);
        if (!existing) {
            existing = {};
            fluid.setGlobalValue(naimspace, existing, env);
        }
        return existing;
    };

    // stubs for two functions in FluidDebugging.js
    fluid.dumpEl = fluid.identity;
    fluid.renderTimestamp = fluid.identity;


    /*** The Model Events system. ***/

    fluid.registerNamespace("fluid.event");

    fluid.generateUniquePrefix = function () {
        return (Math.floor(Math.random() * 1e12)).toString(36) + "-";
    };

    var fluid_prefix = fluid.generateUniquePrefix();

    fluid.fluidInstance = fluid_prefix;

    var fluid_guid = 1;

    /** Allocate an string value that will be very likely unique within this Fluid scope (frame or process) **/

    fluid.allocateGuid = function () {
        return fluid_prefix + (fluid_guid++);
    };

    fluid.event.identifyListener = function (listener) {
        if (typeof(listener) !== "string" && !listener.$$fluid_guid) {
            listener.$$fluid_guid = fluid.allocateGuid();
        }
        return listener.$$fluid_guid;
    };

    // unsupported, NON-API function
    fluid.event.impersonateListener = function (origListener, newListener) {
        fluid.event.identifyListener(origListener);
        newListener.$$fluid_guid = origListener.$$fluid_guid;
    };

    // unsupported, NON-API function
    fluid.event.mapPriority = function (priority, count) {
        // TODO: This should respect both priority and count by a bit-partitioning scheme
        return (priority === null || priority === undefined ? count :
           (priority === "last" ? Number.MAX_VALUE :
              (priority === "first" ? -Number.MAX_VALUE : -priority)));
    };

    // unsupported, NON-API function
    fluid.priorityComparator = function (recA, recB) {
        return recA.priority - recB.priority;
    };

    // unsupported, NON-API function
    fluid.event.sortListeners = function (listeners) {
        var togo = [];
        fluid.each(listeners, function (listener) {
            if (listener.length !== undefined) {
                togo = togo.concat(listener);
            } else {
                togo.push(listener);
            }
        });
        return togo.sort(fluid.priorityComparator);
    };

    // unsupported, non-API function
    fluid.event.invokeListener = function (listener, args) {
        if (typeof(listener) === "string") {
            listener = fluid.event.resolveListener({globalName: listener}); // just resolves globals
        }
        return listener.apply(null, args);
    };

    // unsupported, NON-API function
    fluid.event.resolveListener = function (listener) {
        if (listener.globalName) {
            var listenerFunc = fluid.getGlobalValue(listener.globalName);
            if (!listenerFunc) {
                fluid.fail("Unable to look up name " + listener.globalName + " as a global function");
            } else {
                listener = listenerFunc;
            }
        }
        return listener;
    };

    /** Generate a name for a component for debugging purposes */
    fluid.nameComponent = function (that) {
        return that ? "component with typename " + that.typeName + " and id " + that.id : "[unknown component]";
    };

    fluid.event.nameEvent = function (that, eventName) {
        return eventName + " of " + fluid.nameComponent(that);
    };

    /** Construct an "event firer" object which can be used to register and deregister
     * listeners, to which "events" can be fired. These events consist of an arbitrary
     * function signature. General documentation on the Fluid events system is at
     * http://wiki.fluidproject.org/display/fluid/The+Fluid+Event+System .
     * @param {Boolean} unicast If <code>true</code>, this is a "unicast" event which may only accept
     * a single listener.
     * @param {Boolean} preventable If <code>true</code> the return value of each handler will
     * be checked for <code>false</code> in which case further listeners will be shortcircuited, and this
     * will be the return value of fire()
     */
    fluid.makeEventFirer = function (unicast, preventable, name, ownerId) {
        var that;
        function fireToListeners(listeners, args, wrapper) {
            if (!listeners || that.destroyed) { return; }
            fluid.log(fluid.logLevel.TRACE, "Firing event " + name + " to list of " + listeners.length + " listeners");
            for (var i = 0; i < listeners.length; ++i) {
                var lisrec = listeners[i];
                lisrec.listener = fluid.event.resolveListener(lisrec.listener);
                var listener = lisrec.listener;

                if (lisrec.predicate && !lisrec.predicate(listener, args)) {
                    continue;
                }
                var value;
                var ret = (wrapper ? wrapper(listener) : listener).apply(null, args);
                if (preventable && ret === false || that.destroyed) {
                    value = false;
                }
                if (unicast) {
                    value = ret;
                }
                if (value !== undefined) {
                    return value;
                }
            }
        }
        var identify = fluid.event.identifyListener;


        var lazyInit = function () { // Lazy init function to economise on object references for events which are never listened to
            that.listeners = {};
            that.byId = {};
            that.sortedListeners = [];
            that.addListener = function (listener, namespace, predicate, priority, softNamespace) {
                if (that.destroyed) {
                    fluid.fail("Cannot add listener to destroyed event firer " + that.name);
                }
                if (!listener) {
                    return;
                }
                if (unicast) {
                    namespace = "unicast";
                }
                if (typeof(listener) === "string") {
                    listener = {globalName: listener};
                }
                var id = identify(listener);
                namespace = namespace || id;
                var record = {listener: listener, predicate: predicate,
                    namespace: namespace,
                    softNamespace: softNamespace,
                    priority: fluid.event.mapPriority(priority, that.sortedListeners.length)};
                that.byId[id] = record;
                if (softNamespace) {
                    var thisListeners = (that.listeners[namespace] = fluid.makeArray(that.listeners[namespace]));
                    thisListeners.push(record);
                }
                else {
                    that.listeners[namespace] = record;
                }

                that.sortedListeners = fluid.event.sortListeners(that.listeners);
            };
            that.addListener.apply(null, arguments);
        };
        that = {
            eventId: fluid.allocateGuid(),
            ownerId: ownerId,
            name: name,
            typeName: "fluid.event.firer",
            destroy: function () {
                that.destroyed = true;
            },
            addListener: function () {
                lazyInit.apply(null, arguments);
            },

            removeListener: function (listener) {
                if (!that.listeners) { return; }
                var namespace, id;
                if (typeof (listener) === "string") {
                    namespace = listener;
                    var record = that.listeners[listener];
                    if (!record) {
                        return;
                    }
                    listener = record.length !== undefined ? record : record.listener;
                }
                if (typeof(listener) === "function") {
                    id = identify(listener);
                    if (!id) {
                        fluid.fail("Cannot remove unregistered listener function ", listener, " from event " + that.name);
                    }
                }
                var rec = that.byId[id];
                var softNamespace = rec && rec.softNamespace;
                namespace = namespace || (rec && rec.namespace) || id;
                delete that.byId[id];
                if (softNamespace) {
                    fluid.remove_if(that.listeners[namespace], function (thisLis) {
                        return thisLis.listener.$$fluid_guid === id;
                    });
                } else {
                    delete that.listeners[namespace];
                }
                that.sortedListeners = fluid.event.sortListeners(that.listeners);
            },
            // NB - this method exists currently solely for the convenience of the new,
            // transactional changeApplier. As it exists it is hard to imagine the function
            // being helpful to any other client. We need to get more experience on the kinds
            // of listeners that are useful, and ultimately factor this method away.
            fireToListeners: function (listeners, args, wrapper) {
                return fireToListeners(listeners, args, wrapper);
            },
            fire: function () {
                return fireToListeners(that.sortedListeners, arguments);
            }
        };
        return that;
    };

    // This name will be deprecated in Fluid 1.5 for fluid.makeEventFirer (or fluid.eventFirer)
    fluid.event.getEventFirer = fluid.makeEventFirer;

    /** Fire the specified event with supplied arguments. This call is an optimisation utility
     * which handles the case where the firer has not been instantiated (presumably as a result
     * of having no listeners registered)
     */

    fluid.fireEvent = function (component, path, args) {
        var firer = fluid.get(component, path);
        if (firer) {
            firer.fire.apply(null, fluid.makeArray(args));
        }
    };

    // unsupported, NON-API function
    fluid.event.addListenerToFirer = function (firer, value, namespace, wrapper) {
        wrapper = wrapper || fluid.identity;
        if (fluid.isArrayable(value)) {
            for (var i = 0; i < value.length; ++i) {
                fluid.event.addListenerToFirer(firer, value[i], namespace, wrapper);
            }
        } else if (typeof (value) === "function" || typeof (value) === "string") {
            wrapper(firer).addListener(value, namespace);
        } else if (value && typeof (value) === "object") {
            wrapper(firer).addListener(value.listener, namespace || value.namespace, value.predicate, value.priority, value.softNamespace);
        }
    };

    // unsupported, NON-API function - non-IOC passthrough
    fluid.event.resolveListenerRecord = function (records) {
        return { records: records };
    };

    fluid.expandOptions = function (material) {
        fluid.fail("fluid.expandOptions could not be loaded - please include FluidIoC.js in order to operate IoC-driven event with descriptor " + material);
    };

    // unsupported, NON-API function
    fluid.mergeListeners = function (that, events, listeners) {
        fluid.each(listeners, function (value, key) {
            var firer, namespace;
            if (key.charAt(0) === "{") {
                firer = fluid.expandOptions(key, that);
                if (!firer) {
                    fluid.fail("Error in listener record: key " + key + " could not be looked up to an event firer - did you miss out \"events.\" when referring to an event firer?");
                }
            } else {
                var keydot = key.indexOf(".");

                if (keydot !== -1) {
                    namespace = key.substring(keydot + 1);
                    key = key.substring(0, keydot);
                }
                if (!events[key]) {
                    fluid.fail("Listener registered for event " + key + " which is not defined for this component");
                }
                firer = events[key];
            }
            var record = fluid.event.resolveListenerRecord(value, that, key, namespace, true);
            fluid.event.addListenerToFirer(firer, record.records, namespace, record.adderWrapper);
        });
    };

    // unsupported, NON-API function
    fluid.eventFromRecord = function (eventSpec, eventKey, that) {
        var isIoCEvent = eventSpec && (typeof (eventSpec) !== "string" || eventSpec.charAt(0) === "{");
        var event;
        if (isIoCEvent) {
            if (!fluid.event.resolveEvent) {
                fluid.fail("fluid.event.resolveEvent could not be loaded - please include FluidIoC.js in order to operate IoC-driven event with descriptor ",
                    eventSpec);
            } else {
                event = fluid.event.resolveEvent(that, eventKey, eventSpec);
            }
        } else {
            event = fluid.makeEventFirer(eventSpec === "unicast", eventSpec === "preventable", fluid.event.nameEvent(that, eventKey), that.id);
        }
        return event;
    };

    // unsupported, NON-API function - this is patched from FluidIoC.js
    fluid.instantiateFirers = function (that, options) {
        fluid.each(options.events, function (eventSpec, eventKey) {
            that.events[eventKey] = fluid.eventFromRecord(eventSpec, eventKey, that);
        });
    };

    // unsupported, NON-API function
    fluid.mergeListenerPolicy = function (target, source, key) {
        // cf. triage in mergeListeners
        var hasNamespace = key.charAt(0) !== "{" && key.indexOf(".") !== -1;
        return hasNamespace ? (source || target) : fluid.arrayConcatPolicy(target, source);
    };

    // unsupported, NON-API function
    fluid.makeMergeListenersPolicy = function (merger) {
        return function (target, source) {
            target = target || {};
            fluid.each(source, function (listeners, key) {
                target[key] = merger(target[key], listeners, key);
            });
            return target;
        };
    };

    /** Removes duplicated and empty elements from an already sorted array **/
    fluid.unique = function (array) {
        return fluid.remove_if(array, function (element, i) {
            return !element || i > 0 && element === array[i - 1];
        });
    };

    fluid.arrayConcatPolicy = function (target, source) {
        return fluid.makeArray(target).concat(fluid.makeArray(source));
    };

    /*** DEFAULTS AND OPTIONS MERGING SYSTEM ***/

    /** Create a "type tag" component with no state but simply a type name and id. The most
     *  minimal form of Fluid component */

    fluid.typeTag = function (name) {
        return name ? {
            typeName: name,
            id: fluid.allocateGuid()
        } : null;
    };

    // Definitions for ThreadLocals, the static and dynamic environment - lifted here from
    // FluidIoC.js so that we can issue calls to fluid.describeActivity for debugging purposes
    // in the core framework

    fluid.staticEnvironment = fluid.typeTag("fluid.staticEnvironment");

    // unsupported, non-API function
    fluid.singleThreadLocal = function (initFunc) {
        var value = initFunc();
        return function (newValue) {
            return newValue === undefined ? value : value = newValue;
        };
    };

    // Currently we only support single-threaded environments - ensure that this function
    // is not used on startup so it can be successfully monkey-patched
    // unsupported, non-API function
    fluid.threadLocal = fluid.singleThreadLocal;

    // unsupported, non-API function
    fluid.globalThreadLocal = fluid.threadLocal(function () {
        return fluid.typeTag("fluid.dynamicEnvironment");
    });

    var gradeTick = 1; // tick counter for managing grade cache invalidation
    var gradeTickStore = {};

    var defaultsStore = {};

    var resolveGradesImpl = function (gs, gradeNames, base) {
        var raw = true;
        if (base) {
            raw = gradeNames.length === 1; // We are just resolving a single grade and populating the cache
        }
        else {
            gradeNames = fluid.makeArray(gradeNames);
        }
        fluid.each(gradeNames, function (gradeName) {
            if (gradeName && !gs.gradeHash[gradeName]) {
                var isDynamic = gradeName.charAt(0) === "{";
                var options = (isDynamic ? null : (raw ? fluid.rawDefaults(gradeName) : fluid.getGradedDefaults(gradeName))) || {};
                var thisTick = gradeTickStore[gradeName] || (gradeTick - 1); // a nonexistent grade is recorded as previous to current
                gs.lastTick = Math.max(gs.lastTick, thisTick);
                gs.gradeHash[gradeName] = true;
                gs.gradeChain.push(gradeName);
                gs.optionsChain.push(options);
                var oGradeNames = fluid.makeArray(options.gradeNames);
                for (var i = 0; i < oGradeNames.length; ++ i) {
                    var oGradeName = oGradeNames[i];
                    var isAuto = oGradeName === "autoInit";
                    if (!raw) {
                        if (!gs.gradeHash[oGradeName] && !isAuto) {
                            gs.gradeHash[oGradeName] = true; // these have already been resolved
                            gs.gradeChain.push(oGradeName);
                        }
                    }
                    else if (!isAuto) {
                        resolveGradesImpl(gs, oGradeName);
                    }
                }
            }
        });
        return gs;
    };

    // unsupported, NON-API function
    fluid.resolveGradeStructure = function (defaultName, gradeNames) {
        var gradeStruct = {
            lastTick: 0,
            gradeChain: [],
            gradeHash: {},
            optionsChain: []
        };
        // stronger grades appear to the left in defaults - dynamic grades are stronger still - FLUID-5085
        return resolveGradesImpl(gradeStruct, (fluid.makeArray(gradeNames).reverse() || []).concat([defaultName]), true);
    };

    var mergedDefaultsCache = {};

    // unsupported, NON-API function
    fluid.gradeNamesToKey = function (defaultName, gradeNames) {
        return defaultName + "|" + gradeNames.join("|");
    };

    fluid.hasGrade = function (options, gradeName) {
        return !options || !options.gradeNames ? false : fluid.contains(options.gradeNames, gradeName);
    };

    // unsupported, NON-API function
    fluid.resolveGrade = function (defaults, defaultName, gradeNames) {
        var gradeStruct = fluid.resolveGradeStructure(defaultName, gradeNames);
        var mergeArgs = gradeStruct.optionsChain.reverse();
        var mergePolicy = {};
        for (var i = 0; i < mergeArgs.length; ++ i) {
            if (mergeArgs[i] && mergeArgs[i].mergePolicy) {
                mergePolicy = $.extend(true, mergePolicy, mergeArgs[i].mergePolicy);
            }
        }
        mergeArgs = [mergePolicy, {}].concat(mergeArgs);
        var mergedDefaults = fluid.merge.apply(null, mergeArgs);
        mergedDefaults.gradeNames = gradeStruct.gradeChain;
        if (fluid.hasGrade(defaults, "autoInit")) {
            mergedDefaults.gradeNames.push("autoInit");
        }
        return {defaults: mergedDefaults, lastTick: gradeStruct && gradeStruct.lastTick};
    };

    // unsupported, NON-API function
    fluid.getGradedDefaults = function (defaultName, gradeNames) {
        gradeNames = fluid.makeArray(gradeNames);
        var key = fluid.gradeNamesToKey(defaultName, gradeNames);
        var mergedDefaults = mergedDefaultsCache[key];
        if (mergedDefaults) {
            var lastTick = 0; // check if cache should be invalidated through real latest tick being later than the one stored
            var searchGrades = mergedDefaults.defaults.gradeNames || [];
            for (var i = 0; i < searchGrades.length; ++ i) {
                lastTick = Math.max(lastTick, gradeTickStore[searchGrades[i]] || 0);
            }
            if (lastTick > mergedDefaults.lastTick) {
                fluid.log("Clearing cache for component " + defaultName + " with gradeNames ", searchGrades);
                mergedDefaults = null;
            }
        }
        if (!mergedDefaults) {
            var defaults = fluid.rawDefaults(defaultName);
            if (!defaults) {
                return defaults;
            }
            mergedDefaults = mergedDefaultsCache[key] = fluid.resolveGrade(defaults, defaultName, gradeNames);
        }
        return mergedDefaults.defaults;
    };

    // unsupported, NON-API function
    // Modify supplied options record to include "componentSource" annotation required by FLUID-5082
    // TODO: This function really needs to act recursively in order to catch listeners registered for subcomponents
    fluid.annotateListeners = function (componentName, options) {
        if (options.listeners) {
            options.listeners = fluid.transform(options.listeners, function (record) {
                var togo = fluid.makeArray(record);
                return fluid.transform(togo, function (onerec) {
                    if (!fluid.isPrimitive(onerec)) {
                        onerec.componentSource = componentName;
                    }
                    return onerec;
                });
            });
        }
    };

    // unsupported, NON-API function
    fluid.rawDefaults = function (componentName, options) {
        if (options === undefined) {
            return defaultsStore[componentName];
        } else {
            fluid.pushActivity("registerDefaults", "registering defaults for grade %componentName with options %options",
                {componentName: componentName, options: options});
            var optionsCopy = fluid.expandCompact ? fluid.expandCompact(options) : fluid.copy(options);
            fluid.annotateListeners(componentName, optionsCopy);
            defaultsStore[componentName] = optionsCopy;
            gradeTickStore[componentName] = gradeTick++;
            fluid.popActivity();
        }
    };

    // unsupported, NON-API function
    fluid.doIndexDefaults = function (defaultName, defaults, index, indexSpec) {
        var requiredGrades = fluid.makeArray(indexSpec.gradeNames);
        for (var i = 0; i < requiredGrades.length; ++ i) {
            if (!fluid.hasGrade(defaults, requiredGrades[i])) { return; }
        }
        var indexFunc = typeof(indexSpec.indexFunc) === "function" ? indexSpec.indexFunc : fluid.getGlobalValue(indexSpec.indexFunc);
        var keys = indexFunc(defaults) || [];
        for (var j = 0; j < keys.length; ++ j) {
            (index[keys[j]] = index[keys[j]] || []).push(defaultName);
        }
    };

    /** Evaluates an index specification over all the defaults records registered into the system.
     * @param indexName {String} The name of this index record (currently ignored)
     * @param indexSpec {Object} Specification of the index to be performed - fields:
     *     gradeNames: {String/Array of String} List of grades that must be matched by this indexer
     *     indexFunc:  {String/Function} An index function which accepts a defaults record and returns a list of keys
     * @return A structure indexing keys to lists of matched gradenames
     */
    // The expectation is that this function is extremely rarely used with respect to registration of defaults
    // in the system, so currently we do not make any attempts to cache the results. The field "indexName" is
    // supplied in case a future implementation chooses to implement caching
    fluid.indexDefaults = function (indexName, indexSpec) {
        var index = {};
        for (var defaultName in defaultsStore) {
            var defaults = fluid.getGradedDefaults(defaultName);
            fluid.doIndexDefaults(defaultName, defaults, index, indexSpec);
        }
        return index;
    };

    /**
     * Retrieves and stores a component's default settings centrally.
     * @param {String} componentName the name of the component
     * @param {Object} (optional) an container of key/value pairs to set
     */

    fluid.defaults = function (componentName, options) {
        if (options === undefined) {
            return fluid.getGradedDefaults(componentName);
        }
        else {
            if (options && options.options) {
                fluid.fail("Probable error in options structure for " + componentName +
                    " with option named \"options\" - perhaps you meant to write these options at top level in fluid.defaults? - ", options);
            }
            fluid.rawDefaults(componentName, options);
            if (fluid.hasGrade(options, "autoInit")) {
                fluid.makeComponent(componentName, fluid.getGradedDefaults(componentName));
            }
        }
    };

    fluid.makeComponent = function (componentName, options) {
        if (!options.gradeNames || options.gradeNames.length === 0) {
            fluid.fail("Cannot autoInit component " + componentName + " which does not have any gradeNames defined");
        } else if (!options.initFunction) {
            var blankGrades = [];
            for (var i = 0; i < options.gradeNames.length; ++ i) {
                var gradeName = options.gradeNames[i];
                var defaults = fluid.rawDefaults(gradeName);
                if (!defaults && gradeName !== "autoInit") {
                    blankGrades.push(gradeName);
                }
            }
            if (blankGrades.length === 0) {
                fluid.fail("Cannot autoInit component " + componentName + " which does not have an initFunction defined");
            } else {
                fluid.fail("The grade hierarchy of component with typeName " + componentName + " is incomplete - it inherits from the following grade(s): " +
                 blankGrades.join(", ") + " for which the grade definitions are corrupt or missing. Please check the files which might include these " +
                 " grades and ensure they are readable and have been loaded by this instance of Infusion");
            }
        }
        var creator = function () {
            return fluid.initComponent(componentName, arguments);
        };
        var existing = fluid.getGlobalValue(componentName);
        if (existing) {
            $.extend(creator, existing);
        }
        fluid.setGlobalValue(componentName, creator);
    };

    fluid.makeComponents = function (components) {
        fluid.each(components, function (value, key) {
            var options = {
                gradeNames: fluid.makeArray(value).concat(["autoInit"])
            };
            fluid.defaults(key, options);
        });
    };

    // Cheapskate implementation which avoids dependency on DataBinding.js
    fluid.model.mergeModel = function (target, source) {
        if (!fluid.isPrimitive(target)) {
            var copySource = fluid.copy(source);
            $.extend(true, source, target);
            $.extend(true, source, copySource);
        }
        return source;
    };

    var emptyPolicy = {};
    // unsupported, NON-API function
    fluid.derefMergePolicy = function (policy) {
        return (policy? policy["*"]: emptyPolicy) || emptyPolicy;
    };

    // unsupported, NON-API function
    fluid.compileMergePolicy = function (mergePolicy) {
        var builtins = {}, defaultValues = {};
        var togo = {builtins: builtins, defaultValues: defaultValues};

        if (!mergePolicy) {
            return togo;
        }
        fluid.each(mergePolicy, function (value, key) {
            var parsed = {}, builtin = true;
            if (typeof(value) === "function") {
                parsed.func = value;
            }
            else if (typeof(value) === "object") {
                parsed = value;
            }
            else if (!fluid.isDefaultValueMergePolicy(value)) {
                var split = value.split(/\s*,\s*/);
                for (var i = 0; i < split.length; ++ i) {
                    parsed[split[i]] = true;
                }
            }
            else {
                // Convert to ginger self-reference - NB, this can only be parsed by IoC
                fluid.set(defaultValues, key, "{that}.options." + value);
                togo.hasDefaults = true;
                builtin = false;
            }
            if (builtin) {
                fluid.set(builtins, fluid.composePath(key, "*"), parsed);
            }
        });
        return togo;
    };

    // TODO: deprecate this method of detecting default value merge policies before 1.6 in favour of
    // explicit typed records a la ModelTransformations
    // unsupported, NON-API function
    fluid.isDefaultValueMergePolicy = function (policy) {
        return typeof(policy) === "string" &&
            (policy.indexOf(",") === -1 && !/replace|preserve|nomerge|noexpand/.test(policy));
    };

    // unsupported, NON-API function
    fluid.mergeOneImpl = function (thisTarget, thisSource, j, sources, newPolicy, i, segs) {
        var togo = thisTarget;

        var primitiveTarget = fluid.isPrimitive(thisTarget);

        if (thisSource !== undefined) {
            if (!newPolicy.func && thisSource !== null && fluid.isPlainObject(thisSource) &&
                    !fluid.isDOMish(thisSource) && thisSource !== fluid.VALUE &&
                    !newPolicy.preserve && !newPolicy.nomerge) {
                if (primitiveTarget) {
                    togo = thisTarget = fluid.freshContainer(thisSource);
                }
                // recursion is now external? We can't do it from here since sources are not all known
                // options.recurse(thisTarget, i + 1, segs, sources, newPolicyHolder, options);
            } else {
                sources[j] = undefined;
                if (newPolicy.func) {
                    togo = newPolicy.func.call(null, thisTarget, thisSource, segs[i - 1], segs, i); // NB - change in this mostly unused argument
                } else {
                    togo = fluid.isValue(thisTarget) && newPolicy.preserve ? fluid.model.mergeModel(thisTarget, thisSource) : thisSource;
                }
            }
        }
        return togo;
    };
    // NB - same quadratic worry about these as in FluidIoC in the case the RHS trundler is live -
    // since at each regeneration step driving the RHS we are discarding the "cursor arguments" these
    // would have to be regenerated at each step - although in practice this can only happen once for
    // each object for all time, since after first resolution it will be concrete.
    function regenerateCursor (source, segs, limit, sourceStrategy) {
        for (var i = 0; i < limit; ++ i) {
            source = sourceStrategy(source, segs[i], i, fluid.makeArray(segs)); // copy for FLUID-5243
        }
        return source;
    }

    function regenerateSources (sources, segs, limit, sourceStrategies) {
        var togo = [];
        for (var i = 0; i < sources.length; ++ i) {
            var thisSource = regenerateCursor(sources[i], segs, limit, sourceStrategies[i]);
            if (thisSource !== undefined) {
                togo.push(thisSource);
            }
        }
        return togo;
    }

    // unsupported, NON-API function
    fluid.fetchMergeChildren = function (target, i, segs, sources, mergePolicy, options) { /* unused parameter left for documentation purposes */ // jshint ignore:line
        var thisPolicy = fluid.derefMergePolicy(mergePolicy);
        for (var j = sources.length - 1; j >= 0; -- j) { // this direction now irrelevant - control is in the strategy
            var source = sources[j];
            // NB - this detection relies on strategy return being complete objects - which they are
            // although we need to set up the roots separately. We need to START the process of evaluating each
            // object root (sources) COMPLETELY, before we even begin! Even if the effect of this is to cause a
            // dispatch into ourselves almost immediately. We can do this because we can take control over our
            // TARGET objects and construct them early. Even if there is a self-dispatch, it will be fine since it is
            // DIRECTED and so will not trouble our "slow" detection of properties. After all self-dispatches end, control
            // will THEN return to "evaluation of arguments" (expander blocks) and only then FINALLY to this "slow"
            // traversal of concrete properties to do the final merge.
            if (source !== undefined) {
                // This use of function creation within a loop is acceptable since 
                // the function does not attempt to close directly over the loop counter
                fluid.each(source, function (newSource, name) {
                    if (!target.hasOwnProperty(name)) { // only request each new target key once -- all sources will be queried per strategy
                        segs[i] = name;
                        options.strategy(target, name, i + 1, segs, sources, mergePolicy);
                    }
                });  /* function in loop */ //jshint ignore:line
                if (thisPolicy.replace) { // this branch primarily deals with a policy of replace at the root
                    break;
                }
            }
        }
        return target;
    };

    // A special marker object which will be placed at a current evaluation point in the tree in order
    // to protect against circular evaluation
    fluid.inEvaluationMarker = {"__CURRENTLY_IN_EVALUATION__": true};
    fluid.destroyedMarker = {"__COMPONENT_DESTROYED__": true};

    // A path depth above which the core "process strategies" will bail out, assuming that the
    // structure has become circularly linked. Helpful in environments such as Firebug which will
    // kill the browser process if they happen to be open when a stack overflow occurs. Also provides
    // a more helpful diagnostic.
    fluid.strategyRecursionBailout = 50;

    // unsupported, NON-API function
    fluid.makeMergeStrategy = function (options) {
        var strategy = function (target, name, i, segs, sources, policy) {
            if (i > fluid.strategyRecursionBailout) {
                fluid.fail("Overflow/circularity in options merging, current path is ", segs, " at depth " , i, " - please protect components from merging using the \"nomerge\" merge policy");
            }
            if (fluid.isPrimitive(target)) { // For "use strict"
                return undefined; // Review this after FLUID-4925 since the only trigger is in slow component lookahead
            }
            if (fluid.isTracing) {
                fluid.tracing.pathCount.push(fluid.path(segs.slice(0, i)));
            }

            var oldTarget;
            if (target.hasOwnProperty(name)) { // bail out if our work has already been done
                oldTarget = target[name];
                if (!options.evaluateFully) { // see notes on this hack in "initter" - early attempt to deal with FLUID-4930
                    return oldTarget;
                }
            }
            else { // This is hardwired here for performance reasons - no need to protect deeper strategies
                target[name] = fluid.inEvaluationMarker;
            }
            if (sources === undefined) { // recover our state in case this is an external entry point
                segs = fluid.makeArray(segs); // avoid trashing caller's segs
                sources = regenerateSources(options.sources, segs, i - 1, options.sourceStrategies);
                policy = regenerateCursor(options.mergePolicy, segs, i - 1, fluid.concreteTrundler);
            }
            // var thisPolicy = fluid.derefMergePolicy(policy);
            var newPolicyHolder = fluid.concreteTrundler(policy, name);
            var newPolicy = fluid.derefMergePolicy(newPolicyHolder);

            var start, limit, mul;
            if (newPolicy.replace) {
                start = 1 - sources.length; limit = 0; mul = -1; /* on one line for easier visual comparison of the two algorithms  */ // jshint ignore:line
            }
            else {
                start = 0; limit = sources.length - 1; mul = +1; /* on one line for easier visual comparison of the two algorithms  */ // jshint ignore:line
            }
            var newSources = [];
            var thisTarget;

            for (var j = start; j <= limit; ++j) { // TODO: try to economise on this array and on gaps
                var k = mul * j;
                var thisSource = options.sourceStrategies[k](sources[k], name, i, segs); // Run the RH algorithm in "driving" mode
                if (thisSource !== undefined) {
                    newSources[k] = thisSource;
                    if (oldTarget === undefined) {
                        if (mul === -1) { // if we are going backwards, it is "replace"
                            thisTarget = target[name] = thisSource;
                            break;
                        }
                        else {
                            // write this in early, since early expansions may generate a trunk object which is written in to by later ones
                            thisTarget = target[name] = fluid.mergeOneImpl(thisTarget, thisSource, j, newSources, newPolicy, i, segs, options);
                        }
                    }
                }
            }
            if (oldTarget !== undefined) {
                thisTarget = oldTarget;
            }
            if (newSources.length > 0) {
                if (!fluid.isPrimitive(thisTarget)) {
                    fluid.fetchMergeChildren(thisTarget, i, segs, newSources, newPolicyHolder, options);
                }
            }
            if (oldTarget === undefined && newSources.length === 0) {
                delete target[name]; // remove the evaluation marker - nothing to evaluate
            }
            return thisTarget;
        };
        options.strategy = strategy;
        return strategy;
    };

    // A simple stand-in for "fluid.get" where the material is covered by a single strategy
    fluid.driveStrategy = function (root, pathSegs, strategy) {
        pathSegs = fluid.makeArray(pathSegs);
        for (var i = 0; i < pathSegs.length; ++ i) {
            if (!root) {
                return undefined;
            }
            root = strategy(root, pathSegs[i], i + 1, pathSegs);
        }
        return root;
    };

    // A very simple "new inner trundler" that just performs concrete property access
    // Note that every "strategy" is also a "trundler" of this type, considering just the first two arguments
    fluid.concreteTrundler = function (source, seg) {
        return !source? undefined : source[seg];
    };

    /** Merge a collection of options structures onto a target, following an optional policy.
     * This method is now used only for the purpose of merging "dead" option documents in order to
     * cache graded component defaults. Component option merging is now performed by the
     * fluid.makeMergeOptions pathway which sets up a deferred merging process. This function
     * will not be removed in the Fluid 2.0 release but it is recommended that users not call it
     * directly.
     * The behaviour of this function is explained more fully on
     * the page http://wiki.fluidproject.org/display/fluid/Options+Merging+for+Fluid+Components .
     * @param policy {Object/String} A "policy object" specifiying the type of merge to be performed.
     * If policy is of type {String} it should take on the value "replace" representing
     * a static policy. If it is an
     * Object, it should contain a mapping of EL paths onto these String values, representing a
     * fine-grained policy. If it is an Object, the values may also themselves be EL paths
     * representing that a default value is to be taken from that path.
     * @param options1, options2, .... {Object} an arbitrary list of options structure which are to
     * be merged together. These will not be modified.
     */

    fluid.merge = function (policy /*, ... sources */) {
        var sources = Array.prototype.slice.call(arguments, 1);
        var compiled = fluid.compileMergePolicy(policy).builtins;
        var options = fluid.makeMergeOptions(compiled, sources, {});
        options.initter();
        return options.target;
    };

    // unsupported, NON-API function
    fluid.simpleGingerBlock = function (source, recordType) {
        var block = {
            target: source,
            simple: true,
            strategy: fluid.concreteTrundler,
            initter: fluid.identity,
            recordType: recordType,
            priority: fluid.mergeRecordTypes[recordType]
        };
        return block;
    };

    // unsupported, NON-API function
    fluid.makeMergeOptions = function (policy, sources, userOptions) {
        var options = {
            mergePolicy: policy,
            sources: sources
        };
        options = $.extend(options, userOptions);
        options.target = options.target || fluid.freshContainer(options.sources[0]);
        options.sourceStrategies = options.sourceStrategies || fluid.generate(options.sources.length, fluid.concreteTrundler);
        options.initter = function () {
            // This hack is necessary to ensure that the FINAL evaluation doesn't balk when discovering a trunk path which was already
            // visited during self-driving via the expander. This bi-modality is sort of rubbish, but we currently don't have "room"
            // in the strategy API to express when full evaluation is required - and the "flooding API" is not standardised. See FLUID-4930
            options.evaluateFully = true;
            fluid.fetchMergeChildren(options.target, 0, [], options.sources, options.mergePolicy, options);
        };
        fluid.makeMergeStrategy(options);
        return options;
    };

    // unsupported, NON-API function
    fluid.transformOptions = function (options, transRec) {
        fluid.expect("Options transformation record", ["transformer", "config"], transRec);
        var transFunc = fluid.getGlobalValue(transRec.transformer);
        return transFunc.call(null, options, transRec.config);
    };

    // unsupported, NON-API function
    fluid.findMergeBlocks = function (mergeBlocks, recordType) {
        return fluid.remove_if(fluid.makeArray(mergeBlocks), function (block) { return block.recordType !== recordType; });
    };

    // unsupported, NON-API function
    fluid.transformOptionsBlocks = function (mergeBlocks, transformOptions, recordTypes) {
        fluid.each(recordTypes, function (recordType) {
            var blocks = fluid.findMergeBlocks(mergeBlocks, recordType);
            fluid.each(blocks, function (block) {
                block[block.simple? "target": "source"] = fluid.transformOptions(block.source, transformOptions);
            });
        });
    };

    // unsupported, NON-API function
    fluid.deliverOptionsStrategy = fluid.identity;
    fluid.computeComponentAccessor = fluid.identity;
    fluid.computeDynamicComponents = fluid.identity;

    // The (extensible) types of merge record the system supports, with the weakest records first
    fluid.mergeRecordTypes = {
        defaults:             0,
        localOptions:        50, // provisional
        defaultValueMerge:  100,
        subcomponentRecord: 200,
        distribution:       300,
        // rendererDecorator:  400, // TODO, these are probably honoured already as "user"
        user:               500,
        demands:            600 // and above
    };

    /** Delete the value in the supplied object held at the specified path
     * @param target {Object} The object holding the value to be deleted (possibly empty)
     * @param path {String/Array of String} the path of the value to be deleted
     */

    fluid.destroyValue = function (target, path) {
        if (target) {
            fluid.model.applyChangeRequest(target, {type: "DELETE", path: path});
        }
    };
    /**
     * Merges the component's declared defaults, as obtained from fluid.defaults(),
     * with the user's specified overrides.
     *
     * @param {Object} that the instance to attach the options to
     * @param {String} componentName the unique "name" of the component, which will be used
     * to fetch the default options from store. By recommendation, this should be the global
     * name of the component's creator function.
     * @param {Object} userOptions the user-specified configuration options for this component
     */
    // unsupported, NON-API function
    fluid.mergeComponentOptions = function (that, componentName, userOptions, localOptions) {
        var rawDefaults = fluid.rawDefaults(componentName);
        var defaults = fluid.getGradedDefaults(componentName, rawDefaults && rawDefaults.gradeNames ? null : localOptions.gradeNames);
        var sharedMergePolicy = {};

        var mergeBlocks = [];

        if (fluid.expandComponentOptions) {
            mergeBlocks = mergeBlocks.concat(fluid.expandComponentOptions(sharedMergePolicy, defaults, userOptions, that));
        }
        else {
            mergeBlocks = mergeBlocks.concat([fluid.simpleGingerBlock(defaults, "defaults"),
                                              fluid.simpleGingerBlock(userOptions, "user")]);
        }
        var options = {}; // ultimate target
        var sourceStrategies = [], sources = [];
        var baseMergeOptions = {
            target: options,
            sourceStrategies: sourceStrategies
        };
        // Called both from here and from IoC whenever there is a change of block content or arguments which
        // requires them to be resorted and rebound
        var updateBlocks = function () {
            mergeBlocks.sort(fluid.priorityComparator);
            sourceStrategies.length = 0;
            sources.length = 0;
            fluid.each(mergeBlocks, function (block) {
                sourceStrategies.push(block.strategy);
                sources.push(block.target);
            });
        };
        updateBlocks();
        var mergeOptions = fluid.makeMergeOptions(sharedMergePolicy, sources, baseMergeOptions);
        mergeOptions.mergeBlocks = mergeBlocks;
        mergeOptions.updateBlocks = updateBlocks;
        mergeOptions.destroyValue = function (path) { // This method is a temporary hack to assist FLUID-5091
            for (var i = 0; i < mergeBlocks.length; ++ i) {
                fluid.destroyValue(mergeBlocks[i].target, path);
            }
            fluid.destroyValue(baseMergeOptions.target, path);
        };

        var compiledPolicy;
        var mergePolicy;
        function computeMergePolicy() {
            // Decode the now available mergePolicy
            mergePolicy = fluid.driveStrategy(options, "mergePolicy", mergeOptions.strategy);
            mergePolicy = $.extend({}, fluid.rootMergePolicy, mergePolicy);
            compiledPolicy = fluid.compileMergePolicy(mergePolicy);
            // TODO: expandComponentOptions has already put some builtins here - performance implications of the now huge
            // default mergePolicy material need to be investigated as well as this deep merge
            $.extend(true, sharedMergePolicy, compiledPolicy.builtins); // ensure it gets broadcast to all sharers
        }
        computeMergePolicy();

        if (compiledPolicy.hasDefaults) {
            if (fluid.generateExpandBlock) {
                mergeBlocks.push(fluid.generateExpandBlock({
                        options: compiledPolicy.defaultValues,
                        recordType: "defaultValueMerge",
                        priority: fluid.mergeRecordTypes.defaultValueMerge
                    }, that, {}));
                updateBlocks();
            }
            else {
                fluid.fail("Cannot operate mergePolicy ", mergePolicy, " for component ", that, " without including FluidIoC.js");
            }
        }
        that.options = options;
        var optionsNickName = fluid.driveStrategy(options, "nickName", mergeOptions.strategy);
        that.nickName = optionsNickName || fluid.computeNickName(that.typeName);
        fluid.driveStrategy(options, "gradeNames", mergeOptions.strategy);

        fluid.deliverOptionsStrategy(that, options, mergeOptions); // do this early to broadcast and receive "distributeOptions"

        var transformOptions = fluid.driveStrategy(options, "transformOptions", mergeOptions.strategy);
        if (transformOptions) {
            fluid.transformOptionsBlocks(mergeBlocks, transformOptions, ["user", "subcomponentRecord"]);
            updateBlocks(); // because the possibly simple blocks may have changed target
        }

        fluid.computeComponentAccessor(that);
        if (!baseMergeOptions.target.mergePolicy) {
            computeMergePolicy();
        }

        return mergeOptions;
    };

    // The Fluid Component System proper

    // The base system grade definitions

    fluid.defaults("fluid.function", {});

    fluid.lifecycleFunctions = {
        preInitFunction: true,
        postInitFunction: true,
        finalInitFunction: true
    };

    fluid.rootMergePolicy = $.extend({
        gradeNames: fluid.arrayConcatPolicy,
        distributeOptions: fluid.arrayConcatPolicy,
        transformOptions: "replace"
    }, fluid.transform(fluid.lifecycleFunctions, function () {
        return fluid.mergeListenerPolicy;
    }));

    fluid.defaults("fluid.littleComponent", {
        gradeNames: ["autoInit"],
        initFunction: "fluid.initLittleComponent",
        mergePolicy: fluid.rootMergePolicy,
        argumentMap: {
            options: 0
        }
    });

    fluid.defaults("fluid.eventedComponent", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        events: { // Five standard lifecycle points common to all components
            onCreate:     null,
            onAttach:     null, // onAttach, onClear are only fired for IoC-configured components
            onClear:      null,
            onDestroy:    null,
            afterDestroy: null
        },
        mergePolicy: {
            listeners: fluid.makeMergeListenersPolicy(fluid.mergeListenerPolicy)
        }
    });

    /** A special "marker object" which is recognised as one of the arguments to
     * fluid.initSubcomponents. This object is recognised by reference equality -
     * where it is found, it is replaced in the actual argument position supplied
     * to the specific subcomponent instance, with the particular options block
     * for that instance attached to the overall "that" object.
     * NOTE: The use of this marker has been deprecated as of the Fluid 1.4 release in
     * favour of the contextual EL path "{options}" - it will be removed in a future
     * release of the framework.
     */
    fluid.COMPONENT_OPTIONS = {type: "fluid.marker", value: "COMPONENT_OPTIONS"};

    /** Construct a dummy or "placeholder" subcomponent, that optionally provides empty
     * implementations for a set of methods.
     */
    // TODO: this method is inefficient and inappropriate, should simply discard options entirely pending review
    fluid.emptySubcomponent = function (options) {
        var that = fluid.typeTag("fluid.emptySubcomponent");
        that.options = options || {};
        that.options.gradeNames = [that.typeName];

        options = fluid.makeArray(options);
        for (var i = 0; i < options.length; ++i) {
            that[options[i]] = fluid.identity;
        }
        return that;
    };

    /** Compute a "nickname" given a fully qualified typename, by returning the last path
     * segment.
     */

    fluid.computeNickName = function (typeName) {
        var segs = fluid.model.parseEL(typeName);
        return segs[segs.length - 1];
    };

    /** A combined "component and grade name" which allows type tags to be declaratively constructed
     * from options material. Any component found bearing this grade will be instantiated first amongst
     * its set of siblings, since it is likely to bear a context-forming type name */

    fluid.typeFount = function (options) {
        var that = fluid.initLittleComponent("fluid.typeFount", options);
        return fluid.typeTag(that.options.targetTypeName);
    };

    /**
     * Creates a new "little component": a that-ist object with options merged into it by the framework.
     * This method is a convenience for creating small objects that have options but don't require full
     * View-like features such as the DOM Binder or events
     *
     * @param {Object} name the name of the little component to create
     * @param {Object} options user-supplied options to merge with the defaults
     */
    // NOTE: the 3rd argument localOptions is NOT to be advertised as part of the stable API, it is present
    // just to allow backward compatibility whilst grade specifications are not mandatory - similarly for 4th arg "receiver"
    fluid.initLittleComponent = function (name, userOptions, localOptions, receiver) {
        var that = fluid.typeTag(name);
        localOptions = localOptions || {gradeNames: "fluid.littleComponent"};

        that.destroy = fluid.makeRootDestroy(that); // overwritten by FluidIoC for constructed subcomponents
        var mergeOptions = fluid.mergeComponentOptions(that, name, userOptions, localOptions);
        var options = that.options;
        var evented = fluid.hasGrade(options, "fluid.eventedComponent");
        if (evented) {
            that.events = {};
        }
        // deliver to a non-IoC side early receiver of the component (currently only initView)
        (receiver || fluid.identity)(that, options, mergeOptions.strategy);
        fluid.computeDynamicComponents(that, mergeOptions);

        // TODO: ****THIS**** is the point we must deliver and suspend!! Construct the "component skeleton" first, and then continue
        // for as long as we can continue to find components.
        for (var i = 0; i < mergeOptions.mergeBlocks.length; ++ i) {
            mergeOptions.mergeBlocks[i].initter();
        }
        mergeOptions.initter();
        delete options.mergePolicy;

        fluid.initLifecycleFunctions(that);
        fluid.fireEvent(options, "preInitFunction", that);

        if (evented) {
            fluid.instantiateFirers(that, options);
            fluid.mergeListeners(that, that.events, options.listeners);
        }
        if (!fluid.hasGrade(options, "autoInit")) {
            fluid.clearLifecycleFunctions(options);
        }
        return that;
    };

    // unsupported, NON-API function
    fluid.updateWithDefaultLifecycle = function (key, value, typeName) {
        var funcName = typeName + "." + key.substring(0, key.length - "function".length);
        var funcVal = fluid.getGlobalValue(funcName);
        if (typeof (funcVal) === "function") {
            value = fluid.makeArray(value);
            var existing = fluid.find(value, function (el) {
                var listener = el.listener || el;
                if (listener === funcVal || listener === funcName) {
                    return true;
                }
            });
            if (!existing) {
                value.push(funcVal);
            }
        }
        return value;
    };

    // unsupported, NON-API function
    fluid.initLifecycleFunctions = function (that) {
        var gradeNames = that.options.gradeNames || [];
        fluid.each(fluid.lifecycleFunctions, function (func, key) {
            var value = that.options[key];
            for (var i = gradeNames.length - 1; i >= 0; -- i) { // most specific grades are at front
                if (gradeNames[i] !== "autoInit") {
                    value = fluid.updateWithDefaultLifecycle(key, value, gradeNames[i]);
                }
            }
            if (value) {
                that.options[key] = fluid.makeEventFirer(null, null, key, that.id);
                fluid.event.addListenerToFirer(that.options[key], value);
            }
        });
    };

    // unsupported, NON-API function
    fluid.clearLifecycleFunctions = function (options) {
        fluid.each(fluid.lifecycleFunctions, function (value, key) {
            delete options[key];
        });
        delete options.initFunction;
    };

    fluid.diagnoseFailedView = fluid.identity;

    // unsupported, NON-API function
    fluid.makeRootDestroy = function (that) {
        return function () {
            fluid.fireEvent(that, "events.onClear", [that, "", null]);
            fluid.doDestroy(that);
            fluid.fireEvent(that, "events.afterDestroy", [that, "", null]);
        };
    };
    
    /** Returns <code>true</code> if the supplied reference holds a component which has been destroyed **/
    
    fluid.isDestroyed = function (that) {
        return that.destroy === fluid.destroyedMarker;
    };

    // unsupported, NON-API function    
    fluid.doDestroy = function (that, name, parent) {
        fluid.fireEvent(that, "events.onDestroy", [that, name || "", parent]);
        that.destroy = fluid.destroyedMarker;
        for (var key in that.events) {
            if (key !== "afterDestroy" && typeof(that.events[key].destroy) === "function") {
                that.events[key].destroy();
            }
        }
    };

    fluid.resolveReturnedPath = fluid.identity;

    // unsupported, NON-API function
    fluid.initComponent = function (componentName, initArgs) {
        var options = fluid.defaults(componentName);
        if (!options.gradeNames) {
            fluid.fail("Cannot initialise component " + componentName + " which has no gradeName registered");
        }
        var args = [componentName].concat(fluid.makeArray(initArgs)); // TODO: support different initFunction variants
        var that;
        fluid.pushActivity("initComponent", "constructing component of type %componentName with arguments %initArgs",
            {componentName: componentName, initArgs: initArgs});
        that = fluid.invokeGlobalFunction(options.initFunction, args);
        fluid.diagnoseFailedView(componentName, that, options, args);
        fluid.fireEvent(that.options, "postInitFunction", that);
        if (fluid.initDependents) {
            fluid.initDependents(that);
        }
        fluid.fireEvent(that.options, "finalInitFunction", that);
        fluid.clearLifecycleFunctions(that.options);
        fluid.fireEvent(that, "events.onCreate", that);
        fluid.popActivity();
        return fluid.resolveReturnedPath(that.options.returnedPath, that) ? fluid.get(that, that.options.returnedPath) : that;
    };

    // unsupported, NON-API function
    fluid.initSubcomponentImpl = function (that, entry, args) {
        var togo;
        if (typeof (entry) !== "function") {
            var entryType = typeof (entry) === "string" ? entry : entry.type;
            togo = entryType === "fluid.emptySubcomponent" ?
                fluid.emptySubcomponent(entry.options) :
                fluid.invokeGlobalFunction(entryType, args);
        } else {
            togo = entry.apply(null, args);
        }
        return togo;
    };

    /** Initialise all the "subcomponents" which are configured to be attached to
     * the supplied top-level component, which share a particular "class name". This method
     * of instantiating components is deprecated and will be removed in favour of the automated
     * IoC system in the Fluid 2.0 release.
     * @param {Component} that The top-level component for which sub-components are
     * to be instantiated. It contains specifications for these subcomponents in its
     * <code>options</code> structure.
     * @param {String} className The "class name" or "category" for the subcomponents to
     * be instantiated. A class name specifies an overall "function" for a class of
     * subcomponents and represents a category which accept the same signature of
     * instantiation arguments.
     * @param {Array of Object} args The instantiation arguments to be passed to each
     * constructed subcomponent. These will typically be members derived from the
     * top-level <code>that</code> or perhaps globally discovered from elsewhere. One
     * of these arguments may be <code>fluid.COMPONENT_OPTIONS</code> in which case this
     * placeholder argument will be replaced by instance-specific options configured
     * into the member of the top-level <code>options</code> structure named for the
     * <code>className</code>
     * @return {Array of Object} The instantiated subcomponents, one for each member
     * of <code>that.options[className]</code>.
     */

    fluid.initSubcomponents = function (that, className, args) {
        var entry = that.options[className];
        if (!entry) {
            return;
        }
        var entries = fluid.makeArray(entry);
        var optindex = -1;
        var togo = [];
        args = fluid.makeArray(args);
        for (var i = 0; i < args.length; ++i) {
            if (args[i] === fluid.COMPONENT_OPTIONS) {
                optindex = i;
            }
        }
        for (i = 0; i < entries.length; ++i) {
            entry = entries[i];
            if (optindex !== -1) {
                args[optindex] = entry.options;
            }
            togo[i] = fluid.initSubcomponentImpl(that, entry, args);
        }
        return togo;
    };

    fluid.initSubcomponent = function (that, className, args) {
        return fluid.initSubcomponents(that, className, args)[0];
    };

    // ******* SELECTOR ENGINE *********

    // selector regexps copied from jQuery - recent versions correct the range to start C0
    // The initial portion of the main character selector "just add water" to add on extra
    // accepted characters, as well as the "\\\\." -> "\." portion necessary for matching
    // period characters escaped in selectors
    var charStart = "(?:[\\w\\u00c0-\\uFFFF*_-";

    fluid.simpleCSSMatcher = {
        regexp: new RegExp("([#.]?)(" + charStart + "]|\\\\.)+)", "g"),
        charToTag: {
            "": "tag",
            "#": "id",
            ".": "clazz"
        }
    };

    fluid.IoCSSMatcher = {
        regexp: new RegExp("([&#]?)(" + charStart + "]|\\.)+)", "g"),
        charToTag: {
            "": "context",
            "&": "context",
            "#": "id"
        }
    };

    var childSeg = new RegExp("\\s*(>)?\\s*", "g");
//    var whiteSpace = new RegExp("^\\w*$");

    // Parses a selector expression into a data structure holding a list of predicates
    // 2nd argument is a "strategy" structure, e.g.  fluid.simpleCSSMatcher or fluid.IoCSSMatcher
    // unsupported, non-API function
    fluid.parseSelector = function (selstring, strategy) {
        var togo = [];
        selstring = $.trim(selstring);
        //ws-(ss*)[ws/>]
        var regexp = strategy.regexp;
        regexp.lastIndex = 0;
        var lastIndex = 0;
        while (true) {
            var atNode = []; // a list of predicates at a particular node
            var first = true;
            while (true) {
                var segMatch = regexp.exec(selstring);
                if (!segMatch) {
                    break;
                }
                if (segMatch.index !== lastIndex) {
                    if (first) {
                        fluid.fail("Error in selector string - cannot match child selector expression starting at " + selstring.substring(lastIndex));
                    }
                    else {
                        break;
                    }
                }
                var thisNode = {};
                var text = segMatch[2];
                var targetTag = strategy.charToTag[segMatch[1]];
                if (targetTag) {
                    thisNode[targetTag] = text;
                }
                atNode[atNode.length] = thisNode;
                lastIndex = regexp.lastIndex;
                first = false;
            }
            childSeg.lastIndex = lastIndex;
            var fullAtNode = {predList: atNode};
            var childMatch = childSeg.exec(selstring);
            if (!childMatch || childMatch.index !== lastIndex) {
                fluid.fail("Error in selector string - can not match child selector expression at " + selstring.substring(lastIndex));
            }
            if (childMatch[1] === ">") {
                fullAtNode.child = true;
            }
            togo[togo.length] = fullAtNode;
            // >= test here to compensate for IE bug http://blog.stevenlevithan.com/archives/exec-bugs
            if (childSeg.lastIndex >= selstring.length) {
                break;
            }
            lastIndex = childSeg.lastIndex;
            regexp.lastIndex = childSeg.lastIndex;
        }
        return togo;
    };

    // Message resolution and templating

   /**
    * Converts a string to a regexp with the specified flags given in parameters
    * @param {String} a string that has to be turned into a regular expression
    * @param {String} the flags to provide to the reg exp
    */
    fluid.stringToRegExp = function (str, flags) {
        return new RegExp(str.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"), flags);
    };

    /**
     * Simple string template system.
     * Takes a template string containing tokens in the form of "%value".
     * Returns a new string with the tokens replaced by the specified values.
     * Keys and values can be of any data type that can be coerced into a string. Arrays will work here as well.
     *
     * @param {String}    template    a string (can be HTML) that contains tokens embedded into it
     * @param {object}    values      a collection of token keys and values
     */
    fluid.stringTemplate = function (template, values) {
        var keys = fluid.keys(values);
        keys = keys.sort(fluid.compareStringLength());
        for (var i = 0; i < keys.length; ++i) {
            var key = keys[i];
            var re = fluid.stringToRegExp("%" + key, "g");
            template = template.replace(re, values[key]);
        }
        return template;
    };

    fluid.defaults("fluid.messageResolver", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        mergePolicy: {
            messageBase: "nomerge",
            parents: "nomerge"
        },
        resolveFunc: fluid.stringTemplate,
        parseFunc: fluid.identity,
        messageBase: {},
        parents: []
    });

    fluid.messageResolver.preInit = function (that) {
        that.messageBase = that.options.parseFunc(that.options.messageBase);

        that.lookup = function (messagecodes) {
            var resolved = fluid.messageResolver.resolveOne(that.messageBase, messagecodes);
            if (resolved === undefined) {
                return fluid.find(that.options.parents, function (parent) {
                    return parent ? parent.lookup(messagecodes) : undefined;
                });
            } else {
                return {template: resolved, resolveFunc: that.options.resolveFunc};
            }
        };
        that.resolve = function (messagecodes, args) {
            if (!messagecodes) {
                return "[No messagecodes provided]";
            }
            messagecodes = fluid.makeArray(messagecodes);
            var looked = that.lookup(messagecodes);
            return looked ? looked.resolveFunc(looked.template, args) :
                "[Message string for key " + messagecodes[0] + " not found]";
        };
    };

    // unsupported, NON-API function
    fluid.messageResolver.resolveOne = function (messageBase, messagecodes) {
        for (var i = 0; i < messagecodes.length; ++i) {
            var code = messagecodes[i];
            var message = messageBase[code];
            if (message !== undefined) {
                return message;
            }
        }
    };

    /** Converts a data structure consisting of a mapping of keys to message strings,
     * into a "messageLocator" function which maps an array of message codes, to be
     * tried in sequence until a key is found, and an array of substitution arguments,
     * into a substituted message string.
     */
    fluid.messageLocator = function (messageBase, resolveFunc) {
        var resolver = fluid.messageResolver({messageBase: messageBase, resolveFunc: resolveFunc});
        return function (messagecodes, args) {
            return resolver.resolve(messagecodes, args);
        };
    };

})(jQuery, fluid_1_5);
;/*
Copyright 2007-2010 University of Cambridge
Copyright 2007-2009 University of Toronto
Copyright 2010-2011 Lucendo Development Ltd.
Copyright 2010 OCAD University
Copyright 2005-2013 jQuery Foundation, Inc. and other contributors

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/** This file contains functions which depend on the presence of a DOM document
 * but which do not depend on the contents of Fluid.js **/

var fluid_1_5 = fluid_1_5 || {};

(function ($, fluid) {
    "use strict";

    // polyfill for $.browser which was removed in jQuery 1.9 and later
    // Taken from jquery-migrate-1.2.1.js,
    // jQuery Migrate - v1.2.1 - 2013-05-08
    // https://github.com/jquery/jquery-migrate
    // Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors; Licensed MIT

    fluid.uaMatch = function (ua) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
            /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
            /(msie) ([\w.]+)/.exec( ua ) ||
        ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) || [];

        return {
            browser: match[ 1 ] || "",
            version: match[ 2 ] || "0"
        };
    };

    var matched, browser;

    // Don't clobber any existing jQuery.browser in case it's different
    if (!$.browser) {
        if (!!navigator.userAgent.match(/Trident\/7\./)) {
            browser = { // From http://stackoverflow.com/questions/18684099/jquery-fail-to-detect-ie-11
                msie: true,
                version: 11
            };
        } else {
            matched = fluid.uaMatch(navigator.userAgent);
            browser = {};

            if (matched.browser) {
                browser[matched.browser] = true;
                browser.version = matched.version;
            }
            // Chrome is Webkit, but Webkit is also Safari.
            if (browser.chrome) {
                browser.webkit = true;
            } else if (browser.webkit) {
                browser.safari = true;
            }
        }
        $.browser = browser;
    }

    // Private constants.
    var NAMESPACE_KEY = "fluid-scoped-data";

    /**
     * Gets stored state from the jQuery instance's data map.
     * This function is unsupported: It is not really intended for use by implementors.
     */
    fluid.getScopedData = function(target, key) {
        var data = $(target).data(NAMESPACE_KEY);
        return data ? data[key] : undefined;
    };

    /**
     * Stores state in the jQuery instance's data map. Unlike jQuery's version,
     * accepts multiple-element jQueries.
     * This function is unsupported: It is not really intended for use by implementors.
     */
    fluid.setScopedData = function(target, key, value) {
        $(target).each(function() {
            var data = $.data(this, NAMESPACE_KEY) || {};
            data[key] = value;

            $.data(this, NAMESPACE_KEY, data);
        });
    };

    /** Global focus manager - makes use of "focusin" event supported in jquery 1.4.2 or later.
     */

    var lastFocusedElement = null;

    $(document).bind("focusin", function (event){
        lastFocusedElement = event.target;
    });

    fluid.getLastFocusedElement = function () {
        return lastFocusedElement;
    };


    var ENABLEMENT_KEY = "enablement";

    /** Queries or sets the enabled status of a control. An activatable node
     * may be "disabled" in which case its keyboard bindings will be inoperable
     * (but still stored) until it is reenabled again.
     * This function is unsupported: It is not really intended for use by implementors.
     */

    fluid.enabled = function(target, state) {
        target = $(target);
        if (state === undefined) {
            return fluid.getScopedData(target, ENABLEMENT_KEY) !== false;
        }
        else {
            $("*", target).add(target).each(function() {
                if (fluid.getScopedData(this, ENABLEMENT_KEY) !== undefined) {
                    fluid.setScopedData(this, ENABLEMENT_KEY, state);
                }
                else if (/select|textarea|input/i.test(this.nodeName)) {
                    $(this).prop("disabled", !state);
                }
            });
            fluid.setScopedData(target, ENABLEMENT_KEY, state);
        }
    };

    fluid.initEnablement = function(target) {
        fluid.setScopedData(target, ENABLEMENT_KEY, true);
    };

    // This utility is required through the use of newer versions of jQuery which will obscure the original
    // event responsible for interaction with a target. This is currently use in Tooltip.js and FluidView.js
    // "dead man's blur" but would be of general utility

    fluid.resolveEventTarget = function (event) {
        while (event.originalEvent && event.originalEvent.target) {
            event = event.originalEvent;
        }
        return event.target;
    };

    // These function (fluid.focus() and fluid.blur()) serve several functions. They should be used by
    // all implementation both in test cases and component implementation which require to trigger a focus
    // event. Firstly, they restore the old behaviour in jQuery versions prior to 1.10 in which a focus
    // trigger synchronously relays to a focus handler. In newer jQueries this defers to the real browser
    // relay with numerous platform and timing-dependent effects.
    // Secondly, they are necessary since simulation of focus events by jQuery under IE
    // is not sufficiently good to intercept the "focusin" binding. Any code which triggers
    // focus or blur synthetically throughout the framework and client code must use this function,
    // especially if correct cross-platform interaction is required with the "deadMansBlur" function.

    function applyOp(node, func) {
        node = $(node);
        node.trigger("fluid-"+func);
        node.triggerHandler(func);
        node[func]();
        return node;
    }

    $.each(["focus", "blur"], function(i, name) {
        fluid[name] = function(elem) {
            return applyOp(elem, name);
        };
    });

})(jQuery, fluid_1_5);
;/*
Copyright 2008-2010 University of Cambridge
Copyright 2008-2009 University of Toronto

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid_1_5 = fluid_1_5 || {};

(function ($, fluid) {
    "use strict";

    fluid.dom = fluid.dom || {};

    // Node walker function for iterateDom.
    var getNextNode = function (iterator) {
        if (iterator.node.firstChild) {
            iterator.node = iterator.node.firstChild;
            iterator.depth += 1;
            return iterator;
        }
        while (iterator.node) {
            if (iterator.node.nextSibling) {
                iterator.node = iterator.node.nextSibling;
                return iterator;
            }
            iterator.node = iterator.node.parentNode;
            iterator.depth -= 1;
        }
        return iterator;
    };

    /**
     * Walks the DOM, applying the specified acceptor function to each element.
     * There is a special case for the acceptor, allowing for quick deletion of elements and their children.
     * Return "delete" from your acceptor function if you want to delete the element in question.
     * Return "stop" to terminate iteration.

     * Implementation note - this utility exists mainly for performance reasons. It was last tested
     * carefully some time ago (around jQuery 1.2) but at that time was around 3-4x faster at raw DOM
     * filtration tasks than the jQuery equivalents, which was an important source of performance loss in the
     * Reorderer component. General clients of the framework should use this method with caution if at all, and
     * the performance issues should be reassessed when we have time.
     *
     * @param {Element} node the node to start walking from
     * @param {Function} acceptor the function to invoke with each DOM element
     * @param {Boolean} allnodes Use <code>true</code> to call acceptor on all nodes,
     * rather than just element nodes (type 1)
     */
    fluid.dom.iterateDom = function (node, acceptor, allNodes) {
        var currentNode = {node: node, depth: 0};
        var prevNode = node;
        var condition;
        while (currentNode.node !== null && currentNode.depth >= 0 && currentNode.depth < fluid.dom.iterateDom.DOM_BAIL_DEPTH) {
            condition = null;
            if (currentNode.node.nodeType === 1 || allNodes) {
                condition = acceptor(currentNode.node, currentNode.depth);
            }
            if (condition) {
                if (condition === "delete") {
                    currentNode.node.parentNode.removeChild(currentNode.node);
                    currentNode.node = prevNode;
                }
                else if (condition === "stop") {
                    return currentNode.node;
                }
            }
            prevNode = currentNode.node;
            currentNode = getNextNode(currentNode);
        }
    };

    // Work around IE circular DOM issue. This is the default max DOM depth on IE.
    // http://msdn2.microsoft.com/en-us/library/ms761392(VS.85).aspx
    fluid.dom.iterateDom.DOM_BAIL_DEPTH = 256;

    /**
     * Checks if the specified container is actually the parent of containee.
     *
     * @param {Element} container the potential parent
     * @param {Element} containee the child in question
     */
    fluid.dom.isContainer = function (container, containee) {
        for (; containee; containee = containee.parentNode) {
            if (container === containee) {
                return true;
            }
        }
        return false;
    };

    /** Return the element text from the supplied DOM node as a single String.
     * Implementation note - this is a special-purpose utility used in the framework in just one
     * position in the Reorderer. It only performs a "shallow" traversal of the text and was intended
     * as a quick and dirty means of extracting element labels where the user had not explicitly provided one.
     * It should not be used by general users of the framework and its presence here needs to be
     * reassessed.
     */
    fluid.dom.getElementText = function (element) {
        var nodes = element.childNodes;
        var text = "";
        for (var i = 0; i < nodes.length; ++i) {
            var child = nodes[i];
            if (child.nodeType === 3) {
                text = text + child.nodeValue;
            }
        }
        return text;
    };

})(jQuery, fluid_1_5);
;/*
Copyright 2007-2010 University of Cambridge
Copyright 2007-2009 University of Toronto
Copyright 2007-2009 University of California, Berkeley
Copyright 2010 OCAD University
Copyright 2010-2011 Lucendo Development Ltd.

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid_1_5 = fluid_1_5 || {};
var fluid = fluid || fluid_1_5;

(function ($, fluid) {
    "use strict";

    fluid.renderTimestamp = function (date) {
        var zeropad = function (num, width) {
            if (!width) { width = 2; }
            var numstr = (num === undefined ? "" : num.toString());
            return "00000".substring(5 - width + numstr.length) + numstr;
        };
        return zeropad(date.getHours()) + ":" + zeropad(date.getMinutes()) + ":" + zeropad(date.getSeconds()) + "." + zeropad(date.getMilliseconds(), 3);
    };

    fluid.isTracing = false;

    fluid.registerNamespace("fluid.tracing");

    fluid.tracing.pathCount = [];

    fluid.tracing.summarisePathCount = function (pathCount) {
        pathCount = pathCount || fluid.tracing.pathCount;
        var togo = {};
        for (var i = 0; i < pathCount.length; ++ i) {
            var path = pathCount[i];
            if (!togo[path]) {
                togo[path] = 1;
            }
            else {
                ++togo[path];
            }
        }
        var toReallyGo = [];
        fluid.each(togo, function(el, path) {
            toReallyGo.push({path: path, count: el});
        });
        toReallyGo.sort(function(a, b) {return b.count - a.count;});
        return toReallyGo;
    };

    fluid.tracing.condensePathCount = function (prefixes, pathCount) {
        prefixes = fluid.makeArray(prefixes);
        var prefixCount = {};
        fluid.each(prefixes, function(prefix) {
            prefixCount[prefix] = 0;
        });
        var togo = [];
        fluid.each(pathCount, function(el) {
            var path = el.path;
            if (!fluid.find(prefixes, function(prefix) {
                if (path.indexOf(prefix) === 0) {
                    prefixCount[prefix] += el.count;
                    return true;
                }
            })) {
                togo.push(el);
            }
        });
        fluid.each(prefixCount, function(count, path) {
            togo.unshift({path: path, count: count});
        });
        return togo;
    };

    // Exception stripping code taken from https://github.com/emwendelin/javascript-stacktrace/blob/master/stacktrace.js
    // BSD licence, see header

    fluid.detectStackStyle = function (e) {
        var style = "other";
        var stackStyle = {
            offset: 0
        };
        if (e["arguments"]) {
            style = "chrome";
        } else if (typeof window !== "undefined" && window.opera && e.stacktrace) {
            style = "opera10";
        } else if (e.stack) {
            style = "firefox";
            // Detect FireFox 4-style stacks which are 1 level less deep
            stackStyle.offset = e.stack.indexOf("Trace exception") === -1? 1 : 0;
        } else if (typeof window !== "undefined" && window.opera && !("stacktrace" in e)) { //Opera 9-
            style = "opera";
        }
        stackStyle.style = style;
        return stackStyle;
    };

    fluid.obtainException = function() {
        try {
            throw new Error("Trace exception");
        }
        catch (e) {
            return e;
        }
    };

    var stackStyle = fluid.detectStackStyle(fluid.obtainException());

    fluid.registerNamespace("fluid.exceptionDecoders");

    fluid.decodeStack = function() {
        if (stackStyle.style !== "firefox") {
            return null;
        }
        var e = fluid.obtainException();
        return fluid.exceptionDecoders[stackStyle.style](e);
    };

    fluid.exceptionDecoders.firefox = function(e) {
        var lines = e.stack.replace(/(?:\n@:0)?\s+$/m, "").replace(/^\(/gm, "{anonymous}(").split("\n");
        return fluid.transform(lines, function(line) {
            var atind = line.indexOf("@");
            return atind === -1? [line] : [line.substring(atind + 1), line.substring(0, atind)];
        });
    };

    fluid.getCallerInfo = function(atDepth) {
        atDepth = (atDepth || 3) - stackStyle.offset;
        var stack = fluid.decodeStack();
        return stack? stack[atDepth][0] : null;
    };

    function generate(c, count) {
        var togo = "";
        for (var i = 0; i < count; ++ i) {
            togo += c;
        }
        return togo;
    }

    function printImpl(obj, small, options) {
        var big = small + options.indentChars;
        if (obj === null) {
            return "null";
        }
        else if (fluid.isPrimitive(obj)) {
            return JSON.stringify(obj);
        }
        else {
            var j = [];
            var i;
            if (fluid.isArrayable(obj)) {
                if (obj.length === 0) {
                    return "[]";
                }
                for (i = 0; i < obj.length; ++ i) {
                    j[i] = printImpl(obj[i], big, options);
                }
                return "[\n" + big + j.join(",\n" + big) + "\n" + small + "]";
            }
            else {
                i = 0;
                fluid.each(obj, function(value, key) {
                    j[i++] = JSON.stringify(key) + ": " + printImpl(value, big, options);
                });
                return "{\n" + big + j.join(",\n" + big) + "\n" + small + "}";
            }
        }
    }

    fluid.prettyPrintJSON = function(obj, options) {
        options = $.extend({indent: 4}, options);
        options.indentChars = generate(" ", options.indent);
        return printImpl(obj, "", options);
    };

    /**
     * Dumps a DOM element into a readily recognisable form for debugging - produces a
     * "semi-selector" summarising its tag name, class and id, whichever are set.
     *
     * @param {jQueryable} element The element to be dumped
     * @return A string representing the element.
     */
    fluid.dumpEl = function (element) {
        var togo;

        if (!element) {
            return "null";
        }
        if (element.nodeType === 3 || element.nodeType === 8) {
            return "[data: " + element.data + "]";
        }
        if (element.nodeType === 9) {
            return "[document: location " + element.location + "]";
        }
        if (!element.nodeType && fluid.isArrayable(element)) {
            togo = "[";
            for (var i = 0; i < element.length; ++ i) {
                togo += fluid.dumpEl(element[i]);
                if (i < element.length - 1) {
                    togo += ", ";
                }
            }
            return togo + "]";
        }
        element = $(element);
        togo = element.get(0).tagName;
        if (element.id) {
            togo += "#" + element.id;
        }
        if (element.attr("class")) {
            togo += "." + element.attr("class");
        }
        return togo;
    };

})(jQuery, fluid_1_5);
;/*
Copyright 2011-2013 OCAD University
Copyright 2010-2011 Lucendo Development Ltd.

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid_1_5 = fluid_1_5 || {};

(function ($, fluid) {
    "use strict";

    /** The Fluid "IoC System proper" - resolution of references and
     * completely automated instantiation of declaratively defined
     * component trees */

    // unsupported, non-API function
    // Currently still uses manual traversal - once we ban manually instantiated components,
    // it will use the instantiator's records instead.
    fluid.visitComponentChildren = function (that, visitor, options, path, i) {
        var instantiator = fluid.getInstantiator(that);
        for (var name in that) {
            var newPath = instantiator.composePath(path, name);
            var component = that[name];
            // This entire algorithm is primitive and expensive and will be removed once we can abolish manual init components
            if (!fluid.isComponent(component) || (options.visited && options.visited[component.id])) {continue; }
            if (options.visited) {
                options.visited[component.id] = true;
            }
            if (visitor(component, name, newPath, path, i)) {
                return true;
            }
            if (!options.flat) {
                fluid.visitComponentChildren(component, visitor, options, newPath);
            }
        }
    };

    // unsupported, non-API function
    fluid.getMemberNames = function (instantiator, thatStack) {
        var path = instantiator.idToPath(thatStack[thatStack.length - 1].id);
        var segs = fluid.model.parseEL(path);
        segs.unshift.apply(segs, fluid.generate(thatStack.length - segs.length, ""));
        return segs;
    };

    // thatStack contains an increasing list of MORE SPECIFIC thats.
    // this visits all components starting from the current location (end of stack)
    // in visibility order up the tree.
    var visitComponents = function (instantiator, thatStack, visitor, options) {
        options = options || {
            visited: {},
            flat: true,
            instantiator: instantiator
        };
        var memberNames = fluid.getMemberNames(instantiator, thatStack);
        for (var i = thatStack.length - 1; i >= 0; --i) {
            var that = thatStack[i], path;
            if (that.typeName) {
                options.visited[that.id] = true;
                path = instantiator.idToPath[that.id];
                if (visitor(that, memberNames[i], path, path, i)) {
                    return;
                }
            }
            if (fluid.visitComponentChildren(that, visitor, options, path, i)) {
                return;
            }
        }
    };

    fluid.mountStrategy = function (prefix, root, toMount) {
        var offset = prefix.length;
        return function (target, name, i, segs) {
            if (i <= prefix.length) { // Avoid OOB to not trigger deoptimisation!
                return;
            }
            for (var j = 0; j < prefix.length; ++ j) {
                if (segs[j] !== prefix[j]) {
                    return;
                }
            }
            return toMount(target, name, i - prefix.length, segs.slice(offset));
        };
    };

    // unsupported, NON-API function
    fluid.invokerFromRecord = function (invokerec, name, that) {
        fluid.pushActivity("makeInvoker", "beginning instantiation of invoker with name %name and record %record as child of %that",
            {name: name, record: invokerec, that: that});
        var invoker = fluid.makeInvoker(that, invokerec, name);
        fluid.popActivity();
        return invoker;
    };

    // unsupported, NON-API function
    fluid.memberFromRecord = function (memberrec, name, that) {
        var value = fluid.expandOptions(memberrec, that, null, null, {freeRoot: true});
        return value;
    };

    // unsupported, NON-API function
    fluid.recordStrategy = function (that, options, optionsStrategy, recordPath, recordMaker, prefix) {
        prefix = prefix || [];
        return {
            strategy: function (target, name, i) {
                if (i !== 1) {
                    return;
                }
                var record = fluid.driveStrategy(options, [recordPath, name], optionsStrategy);
                if (record === undefined) {
                    return;
                }
                fluid.set(target, [name], fluid.inEvaluationMarker);
                var member = recordMaker(record, name, that);
                fluid.set(target, [name], member);
                return member;
            },
            initter: function () {
                var records = fluid.driveStrategy(options, recordPath, optionsStrategy) || {};
                for (var name in records) {
                    fluid.getForComponent(that, prefix.concat([name]));
                }
            }
        };
    };

    // patch Fluid.js version for timing
    // unsupported, NON-API function
    fluid.instantiateFirers = function (that) {
        var shadow = fluid.shadowForComponent(that);
        var initter = fluid.get(shadow, ["eventStrategyBlock", "initter"]) || fluid.identity;
        initter();
    };

    // unsupported, NON-API function
    fluid.makeDistributionRecord = function (contextThat, sourceRecord, sourcePath, targetSegs, exclusions, offset, sourceType) {
        offset = offset || 0;
        sourceType = sourceType || "distribution";

        var source = fluid.copy(fluid.get(sourceRecord, sourcePath));
        fluid.each(exclusions, function (exclusion) {
            fluid.model.applyChangeRequest(source, {path: exclusion, type: "DELETE"});
        });

        var record = {options: {}};
        var primitiveSource = fluid.isPrimitive(source);
        fluid.model.applyChangeRequest(record, {path: targetSegs, type: primitiveSource? "ADD": "MERGE", value: source});
        return $.extend(record, {contextThat: contextThat, recordType: sourceType, priority: fluid.mergeRecordTypes.distribution + offset});
    };

    // unsupported, NON-API function
    // Part of the early "distributeOptions" workflow. Given the description of the blocks to be distributed, assembles "canned" records
    // suitable to be either registered into the shadow record for later or directly pushed to an existing component, as well as honouring
    // any "removeSource" annotations by removing these options from the source block.
    fluid.filterBlocks = function (contextThat, sourceBlocks, sourcePath, targetSegs, exclusions, removeSource) {
        var togo = [], offset = 0;
        fluid.each(sourceBlocks, function (block) {
            var source = fluid.get(block.source, sourcePath);
            if (source) {
                togo.push(fluid.makeDistributionRecord(contextThat, block.source, sourcePath, targetSegs, exclusions, offset++, block.recordType));
                var rescued = $.extend({}, source);
                if (removeSource) {
                    fluid.model.applyChangeRequest(block.source, {path: sourcePath, type: "DELETE"});
                }
                fluid.each(exclusions, function (exclusion) {
                    var orig = fluid.get(rescued, exclusion);
                    fluid.set(block.source, sourcePath.concat(exclusion), orig);
                });
            }
        });
        return togo;
    };

    // unsupported, NON-API function
    // TODO: This implementation is obviously poor and has numerous flaws
    fluid.matchIoCSelector = function (selector, thatStack, contextHashes, memberNames, i) {
        var thatpos = thatStack.length - 1;
        var selpos = selector.length - 1;
        while (true) {
            var mustMatchHere = thatpos === thatStack.length - 1 || selector[selpos].child;

            var that = thatStack[thatpos];
            var selel = selector[selpos];
            var match = true;
            for (var j = 0; j < selel.predList.length; ++j) {
                var pred = selel.predList[j];
                if (pred.context && !(contextHashes[thatpos][pred.context] || memberNames[thatpos] === pred.context)) {
                    match = false;
                    break;
                }
                if (pred.id && that.id !== pred.id) {
                    match = false;
                    break;
                }
            }
            if (selpos === 0 && thatpos > i && mustMatchHere) {
                match = false; // child selector must exhaust stack completely - FLUID-5029
            }
            if (match) {
                if (selpos === 0) {
                    return true;
                }
                --thatpos;
                --selpos;
            }
            else {
                if (mustMatchHere) {
                    return false;
                }
                else {
                    --thatpos;
                }
            }
            if (thatpos < i) {
                return false;
            }
        }
    };

    // Use this peculiar signature since the actual component and shadow itself may not exist yet. Perhaps clean up with FLUID-4925
    fluid.noteCollectedDistribution = function (parentShadow, memberName, distribution) {
        fluid.model.setSimple(parentShadow, ["collectedDistributions", memberName, distribution.id], true);
    };

    fluid.isCollectedDistribution = function (parentShadow, memberName, distribution) {
        return fluid.model.getSimple(parentShadow, ["collectedDistributions", memberName, distribution.id]);
    };

    fluid.clearCollectedDistributions = function (parentShadow, memberName) {
        fluid.model.applyChangeRequest(parentShadow, {path: ["collectedDistributions", memberName], type: "DELETE"});
    };

    // unsupported, NON-API function
    fluid.collectDistributions = function (distributedBlocks, parentShadow, distribution, thatStack, contextHashes, memberNames, i) {
        var lastMember = memberNames[memberNames.length - 1];
        if (!fluid.isCollectedDistribution(parentShadow, lastMember, distribution) &&
                fluid.matchIoCSelector(distribution.selector, thatStack, contextHashes, memberNames, i)) {
            distributedBlocks.push.apply(distributedBlocks, distribution.blocks);
            fluid.noteCollectedDistribution(parentShadow, lastMember, distribution);
        }
    };

    // Slightly silly function to clean up the "appliedDistributions" records. In general we need to be much more aggressive both
    // about clearing instantiation garbage (e.g. onCreate and most of the shadow)
    // as well as caching frequently-used records such as the "thatStack" which
    // would mean this function could be written in a sensible way
    fluid.registerCollectedClearer = function (shadow, parentShadow, memberName) {
        if (!shadow.collectedClearer && parentShadow) {
            shadow.collectedClearer = function () {
                fluid.clearCollectedDistributions(parentShadow, memberName);
            };
        }
    };

    // unsupported, NON-API function
    fluid.receiveDistributions = function (parentThat, gradeNames, memberName, that) {
        var instantiator = fluid.getInstantiator(parentThat || that);
        var thatStack = instantiator.getThatStack(parentThat || that); // most specific is at end
        var memberNames = fluid.getMemberNames(instantiator, thatStack);
        var distributedBlocks = [];
        var shadows = fluid.transform(thatStack, function (thisThat) {
            return instantiator.idToShadow[thisThat.id];
        });
        var parentShadow = shadows[shadows.length - (parentThat ? 1 : 2)];
        var contextHashes = fluid.getMembers(shadows, "contextHash");
        if (parentThat) { // if called before construction of component from embodyDemands - NB this path will be abolished/amalgamated
            memberNames.push(memberName);
            contextHashes.push(fluid.gradeNamesToHash(gradeNames));
            thatStack.push(that);
        } else {
            fluid.registerCollectedClearer(shadows[shadows.length - 1], parentShadow, memberNames[memberNames.length - 1]);
        }
        // This use of function creation within a loop is acceptable since 
        // the function does not attempt to close directly over the loop counter
        for (var i = 0; i < thatStack.length - 1; ++ i) {
            fluid.each(shadows[i].distributions, function (distribution) {
                fluid.collectDistributions(distributedBlocks, parentShadow, distribution, thatStack, contextHashes, memberNames, i);
            });  /* function in loop */ /* jshint ignore:line */
        }
        return distributedBlocks;
    };

    // unsupported, NON-API function
    // convert "preBlocks" as produced from fluid.filterBlocks into "real blocks" suitable to be used by the expansion machinery.
    fluid.applyDistributions = function (that, preBlocks, targetShadow) {
        var distributedBlocks = fluid.transform(preBlocks, function (preBlock) {
            return fluid.generateExpandBlock(preBlock, that, targetShadow.mergePolicy);
        });
        var mergeOptions = targetShadow.mergeOptions;
        mergeOptions.mergeBlocks.push.apply(mergeOptions.mergeBlocks, distributedBlocks);
        mergeOptions.updateBlocks();
        return distributedBlocks;
    };

    // unsupported, NON-API function
    fluid.parseExpectedOptionsPath = function (path, role) {
        var segs = fluid.model.parseEL(path);
        if (segs.length > 1 && segs[0] !== "options") {
            fluid.fail("Error in options distribution path ", path, " - only " + role + " paths beginning with \"options\" are supported");
        }
        return segs.slice(1);
    };

    // unsupported, NON-API function
    fluid.isIoCSSSelector = function (context) {
        return context.indexOf(" ") !== -1; // simple-minded check for an IoCSS reference
    };

    // unsupported, NON-API function
    fluid.pushDistributions = function (targetHead, selector, blocks) {
        var targetShadow = fluid.shadowForComponent(targetHead);
        var id = fluid.allocateGuid();
        var distributions = (targetShadow.distributions = targetShadow.distributions || []);
        distributions.push({
            id: id, // This id is used in clearDistributions - which itself currently only seems to appear in IoCTestUtils
            selector: selector,
            blocks: blocks
        });
        return id;
    };

    // unsupported, NON-API function
    fluid.clearDistributions = function (targetHead, id) {
        var targetShadow = fluid.shadowForComponent(targetHead);
        fluid.remove_if(targetShadow.distributions, function (distribution) {
            return distribution.id === id;
        });
    };

    // unsupported, NON-API function
    // Modifies a parsed selector to extra its head context which will be matched upwards
    fluid.extractSelectorHead = function (parsedSelector) {
        var predList = parsedSelector[0].predList;
        var context = predList[0].context;
        predList.length = 0;
        return context;
    };

    fluid.undistributableOptions = ["gradeNames", "distributeOptions", "returnedPath", "argumentMap", "initFunction", "mergePolicy", "progressiveCheckerOptions"]; // automatically added to "exclusions" of every distribution

    // unsupported, NON-API function
    fluid.distributeOptions = function (that, optionsStrategy) {
        var records = fluid.makeArray(fluid.driveStrategy(that.options, "distributeOptions", optionsStrategy));
        fluid.each(records, function (record) {
            var targetRef = fluid.parseContextReference(record.target);
            var targetComp, selector;
            if (fluid.isIoCSSSelector(targetRef.context)) {
                selector = fluid.parseSelector(targetRef.context, fluid.IoCSSMatcher);
                var headContext = fluid.extractSelectorHead(selector);
                if (headContext !== "that") {
                    fluid.fail("Downwards options distribution not supported from component other than \"that\"");
                }
                targetComp = that;
            }
            else {
                targetComp = fluid.resolveContext(targetRef.context, that);
                if (!targetComp) {
                    fluid.fail("Error in options distribution record ", record, " - could not resolve context selector {"+targetRef.context+"} to a root component");
                }
            }
            var targetSegs = fluid.model.parseEL(targetRef.path);
            var preBlocks;
            if (record.record !== undefined) {
                preBlocks = [(fluid.makeDistributionRecord(that, record.record, [], targetSegs, [], 0))];
            }
            else {
                var thatShadow = fluid.shadowForComponent(that);
                var source = fluid.parseContextReference(record.source || "{that}.options"); // TODO: This is probably not a sensible default
                if (source.context !== "that") {
                    fluid.fail("Error in options distribution record ", record, " only a context of {that} is supported");
                }
                var sourcePath = fluid.parseExpectedOptionsPath(source.path, "source");
                var fullExclusions = fluid.makeArray(record.exclusions).concat(sourcePath.length === 0 ? fluid.undistributableOptions : []);

                var exclusions = fluid.transform(fullExclusions, function (exclusion) {
                    return fluid.model.parseEL(exclusion);
                });

                preBlocks = fluid.filterBlocks(that, thatShadow.mergeOptions.mergeBlocks, sourcePath, targetSegs, exclusions, record.removeSource);
                thatShadow.mergeOptions.updateBlocks(); // perhaps unnecessary
            }
            // TODO: inline material has to be expanded in its original context!

            if (selector) {
                fluid.pushDistributions(targetComp, selector, preBlocks);
            }
            else { // The component exists now, we must rebalance it
                var targetShadow = fluid.shadowForComponent(targetComp);
                fluid.applyDistributions(that, preBlocks, targetShadow);
            }
        });
    };

    // unsupported, NON-API function
    fluid.gradeNamesToHash = function (gradeNames) {
        var contextHash = {};
        fluid.each(gradeNames, function (gradeName) {
            contextHash[gradeName] = true;
            contextHash[fluid.computeNickName(gradeName)] = true;
        });
        return contextHash;
    };

    // unsupported, NON-API function
    fluid.cacheShadowGrades = function (that, shadow) {
        var contextHash = fluid.gradeNamesToHash(that.options.gradeNames);
        contextHash[that.nickName] = true;
        shadow.contextHash = contextHash;
    };

    // First sequence point where the mergeOptions strategy is delivered from Fluid.js - here we take care
    // of both receiving and transmitting options distributions
    // unsupported, NON-API function
    fluid.deliverOptionsStrategy = function (that, target, mergeOptions) {
        var shadow = fluid.shadowForComponent(that, shadow);
        fluid.cacheShadowGrades(that, shadow);
        shadow.mergeOptions = mergeOptions;
    };

    // unsupported, NON-API function
    fluid.resolveReturnedPath = function (returnedPath, that) {
        var shadow = fluid.shadowForComponent(that);
        // This prevents corruption of instantiator records by defeating effect of "returnedPath" for non-roots
        return shadow && shadow.path !== "" ? null : returnedPath;
    };

    fluid.defaults("fluid.gradeLinkageRecord", {
        gradeNames: ["fluid.littleComponent"]
    });

    /** A "tag component" to opt in to the grade linkage system (FLUID-5212) which is currently very expensive -
      * this will become the default once we have a better implementation and have stabilised requirements
      */
    fluid.defaults("fluid.applyGradeLinkage", { });

    fluid.gradeLinkageIndexer = function (defaults) {
        if (defaults.contextGrades && defaults.resultGrades) {
            return ["*"];
        }
    };

    fluid.getLinkedGrades = function (gradeNames) {
        var togo = [];
        var gradeLinkages = fluid.indexDefaults("gradeLinkages", {
            gradeNames: "fluid.gradeLinkageRecord",
            indexFunc: fluid.gradeLinkageIndexer
        });
        fluid.each(gradeLinkages["*"], function (defaultsName) {
            var defaults = fluid.defaults(defaultsName);
            var exclude = fluid.find(fluid.makeArray(defaults.contextGrades),
                function (grade) {
                    if (!fluid.contains(gradeNames, grade)) {
                        return true;
                    }
                }
            );
            if (!exclude) {
                togo.push.apply(togo, fluid.makeArray(defaults.resultGrades));
            }
        });
        return togo;
    };

    fluid.expandDynamicGrades = function (that, shadow, gradeNames, dynamicGrades) {
        var resolved = [];
        fluid.each(dynamicGrades, function (dynamicGrade) {
            var expanded = fluid.expandOptions(dynamicGrade, that);
            if (typeof(expanded) === "function") {
                expanded = expanded();
            }
            if (expanded) {
                resolved = resolved.concat(expanded);
            }
        });
        var allGrades = fluid.makeArray(gradeNames).concat(resolved);
        if (fluid.contains(allGrades, "fluid.applyGradeLinkage")) {
            var linkedGrades = fluid.getLinkedGrades(allGrades);
            fluid.remove_if(linkedGrades, function (gradeName) {
                return fluid.contains(allGrades, gradeName);
            });
            resolved = resolved.concat(linkedGrades);
        }
        var distributedBlocks = fluid.receiveDistributions(null, null, null, that);
        if (distributedBlocks.length > 0) {
            var readyBlocks = fluid.applyDistributions(that, distributedBlocks, shadow);
            // rely on the fact that "dirty tricks are not permitted" wrt. resolving gradeNames - each element must be a literal entry or array
            // holding primitive or EL values - otherwise we would have to go all round the houses and reenter the top of fluid.computeDynamicGrades
            var gradeNamesList = fluid.transform(fluid.getMembers(readyBlocks, ["source", "gradeNames"]), fluid.makeArray);
            resolved = resolved.concat.apply(resolved, gradeNamesList);
        }
        return resolved;
    };

    // Discover further grades that are entailed by the given base typeName and the current total "dynamic grades list" held in the argument "resolved".
    // These are looked up conjointly in the grade registry, and then any further i) dynamic grades references {} ii) grade linkage records
    // are expanded and added into the list and concatenated into "resolved". Additional grades discovered during this function are returned as
    // "furtherResolved".
    fluid.collectDynamicGrades = function (that, shadow, defaultsBlock, gradeNames, dynamicGrades, resolved) {
        var newDefaults = fluid.copy(fluid.getGradedDefaults(that.typeName, resolved));
        gradeNames.length = 0; // acquire derivatives of dynamic grades (FLUID-5054)
        gradeNames.push.apply(gradeNames, newDefaults.gradeNames);

        fluid.cacheShadowGrades(that, shadow);
        // This cheap strategy patches FLUID-5091 for now - some more sophisticated activity will take place
        // at this site when we have a full fix for FLUID-5028
        shadow.mergeOptions.destroyValue("mergePolicy");
        shadow.mergeOptions.destroyValue("components");
        shadow.mergeOptions.destroyValue("invokers");

        defaultsBlock.source = newDefaults;
        shadow.mergeOptions.updateBlocks();

        var furtherResolved = fluid.remove_if(gradeNames, function (gradeName) {
            return gradeName.charAt(0) === "{" && !fluid.contains(dynamicGrades, gradeName);
        }, []);
        dynamicGrades.push.apply(dynamicGrades, furtherResolved);
        furtherResolved = fluid.expandDynamicGrades(that, shadow, gradeNames, furtherResolved);

        resolved.push.apply(resolved, furtherResolved);

        return furtherResolved;
    };

    // unsupported, NON-API function
    fluid.computeDynamicGrades = function (that, shadow, strategy) {
        delete that.options.gradeNames; // Recompute gradeNames for FLUID-5012 and others

        var gradeNames = fluid.driveStrategy(that.options, "gradeNames", strategy);
        // TODO: In complex distribution cases, a component might end up with multiple default blocks
        var defaultsBlock = fluid.findMergeBlocks(shadow.mergeOptions.mergeBlocks, "defaults")[0];
        var dynamicGrades = fluid.remove_if(gradeNames, function (gradeName) {
            return gradeName.charAt(0) === "{" || !fluid.hasGrade(defaultsBlock.target, gradeName);
        }, []);
        var resolved = fluid.expandDynamicGrades(that, shadow, gradeNames, dynamicGrades);
        if (resolved.length !== 0) {
            var furtherResolved;
            do { // repeatedly collect dynamic grades whilst they arrive (FLUID-5155)
                furtherResolved = fluid.collectDynamicGrades(that, shadow, defaultsBlock, gradeNames, dynamicGrades, resolved);
            }
            while (furtherResolved.length !== 0);
        }
        if (shadow.collectedClearer) {
            shadow.collectedClearer();
            delete shadow.collectedClearer;
        }
    };

    fluid.computeDynamicComponentKey = function (recordKey, sourceKey) {
        return recordKey + (sourceKey === 0 ? "" : "-" + sourceKey); // TODO: configurable name strategies
    };

    // unsupported, NON-API function
    fluid.registerDynamicRecord = function (that, recordKey, sourceKey, record, toCensor) {
        var key = fluid.computeDynamicComponentKey(recordKey, sourceKey);
        var cRecord = fluid.copy(record);
        delete cRecord[toCensor];
        fluid.set(that.options, ["components", key], cRecord);
        return key;
    };

    // unsupported, NON-API function
    fluid.computeDynamicComponents = function (that, mergeOptions) {
        var shadow = fluid.shadowForComponent(that);
        var localSub = shadow.subcomponentLocal = {};
        var records = fluid.driveStrategy(that.options, "dynamicComponents", mergeOptions.strategy);
        fluid.each(records, function (record, recordKey) {
            if (!record.sources && !record.createOnEvent) {
                fluid.fail("Cannot process dynamicComponents record ", record, " without a \"sources\" or \"createOnEvent\" entry");
            }
            if (record.sources) {
                var sources = fluid.expandOptions(record.sources, that);
                fluid.each(sources, function (source, sourceKey) {
                    var key = fluid.registerDynamicRecord(that, recordKey, sourceKey, record, "sources");
                    localSub[key] = {"source": source, "sourcePath": sourceKey};
                });
            }
            else if (record.createOnEvent) {
                var event = fluid.event.expandOneEvent(that, record.createOnEvent);
                fluid.set(shadow, ["dynamicComponentCount", recordKey], 0);
                var listener = function () {
                    var key = fluid.registerDynamicRecord(that, recordKey, shadow.dynamicComponentCount[recordKey]++, record, "createOnEvent");
                    localSub[key] = {"arguments": fluid.makeArray(arguments)};
                    fluid.initDependent(that, key);
                };
                event.addListener(listener);
                fluid.recordListener(event, listener, shadow);
            }
        });
    };

    // Second sequence point for mergeOptions from Fluid.js - here we construct all further
    // strategies required on the IoC side and mount them into the shadow's getConfig for universal use
    // unsupported, NON-API function
    fluid.computeComponentAccessor = function (that) {
        var shadow = fluid.shadowForComponent(that);
        var options = that.options;
        var strategy = shadow.mergeOptions.strategy;
        var optionsStrategy = fluid.mountStrategy(["options"], options, strategy);
        shadow.invokerStrategy = fluid.recordStrategy(that, options, strategy, "invokers", fluid.invokerFromRecord);
        shadow.eventStrategyBlock = fluid.recordStrategy(that, options, strategy, "events", fluid.eventFromRecord, ["events"]);
        var eventStrategy = fluid.mountStrategy(["events"], that, shadow.eventStrategyBlock.strategy, ["events"]);
        shadow.memberStrategy = fluid.recordStrategy(that, options, strategy, "members", fluid.memberFromRecord);
        // NB - ginger strategy handles concrete, rationalise
        shadow.getConfig = {strategies: [fluid.model.funcResolverStrategy, fluid.makeGingerStrategy(that),
            optionsStrategy, shadow.invokerStrategy.strategy, shadow.memberStrategy.strategy, eventStrategy]};

        fluid.computeDynamicGrades(that, shadow, strategy, shadow.mergeOptions.mergeBlocks);
        fluid.distributeOptions(that, strategy);

        return shadow.getConfig;
    };

    fluid.shadowForComponent = function (component) {
        var instantiator = fluid.getInstantiator(component);
        return instantiator && component ? instantiator.idToShadow[component.id] : null;
    };

    fluid.getForComponent = function (component, path) {
        var shadow = fluid.shadowForComponent(component);
        var getConfig = shadow ? shadow.getConfig : undefined;
        return fluid.get(component, path, getConfig);
    };

    // An EL segment resolver strategy that will attempt to trigger creation of
    // components that it discovers along the EL path, if they have been defined but not yet
    // constructed.
    // unsupported, NON-API function
    fluid.makeGingerStrategy = function (that) {
        var instantiator = fluid.getInstantiator(that);
        return function (component, thisSeg, index, segs) {
            var atval = component[thisSeg];
            if (atval === fluid.inEvaluationMarker && index === segs.length) {
                fluid.fail("Error in component configuration - a circular reference was found during evaluation of path segment \"" + thisSeg +
                    "\": for more details, see the activity records following this message in the console, or issue fluid.setLogging(fluid.logLevel.TRACE) when running your application");
            }
            if (index > 1) {
                return atval;
            }
            if (atval === undefined && component.hasOwnProperty(thisSeg)) { // avoid recomputing properties that have been explicitly evaluated to undefined
                return fluid.NO_VALUE;
            }
            if (atval === undefined) { // pick up components in instantiation here - we can cut this branch by attaching early
                var parentPath = instantiator.idToShadow[component.id].path;
                var childPath = fluid.composePath(parentPath, thisSeg);
                atval = instantiator.pathToComponent[childPath];
            }
            if (atval === undefined) {
                // TODO: This check is very expensive - once gingerness is stable, we ought to be able to
                // eagerly compute and cache the value of options.components - check is also incorrect and will miss injections
                if (fluid.getForComponent(component, ["options", "components", thisSeg])) {
                    fluid.initDependent(component, thisSeg);
                    atval = component[thisSeg];
                }
            }
            return atval;
        };
    };

    fluid.filterBuiltinGrades = function (gradeNames) {
        return fluid.remove_if(fluid.makeArray(gradeNames), function (gradeName) {
            return (/^(autoInit|fluid.littleComponent|fluid.modelComponent|fluid.eventedComponent|fluid.viewComponent|fluid.typeFount)$/).test(gradeName);
        });
    };

    fluid.dumpGradeNames = function (that) {
        return that.options && that.options.gradeNames ?
            " gradeNames: " + JSON.stringify(fluid.filterBuiltinGrades(that.options.gradeNames)) : "";
    };

    // unsupported, non-API function
    fluid.dumpThat = function (that) {
        return "{ typeName: \"" + that.typeName + "\"" + fluid.dumpGradeNames(that) + " id: " + that.id + "}";
    };

    // unsupported, non-API function
    fluid.dumpThatStack = function (thatStack, instantiator) {
        var togo = fluid.transform(thatStack, function(that) {
            var path = instantiator.idToPath(that.id);
            return fluid.dumpThat(that) + (path? (" - path: " + path) : "");
        });
        return togo.join("\n");
    };

    // unsupported, NON-API function
    fluid.resolveContext = function (context, that) {
        var instantiator = fluid.getInstantiator(that);
        if (context === "instantiator") {
            return instantiator;
        }
        else if (context === "that") {
            return that;
        }
        var foundComponent;
        var thatStack = instantiator.getFullStack(that);
        visitComponents(instantiator, thatStack, function (component, name) {
            var shadow = fluid.shadowForComponent(component);
            // TODO: Some components, e.g. the static environment and typeTags do not have a shadow, which slows us down here
            if (context === name || shadow && shadow.contextHash && shadow.contextHash[context] || context === component.typeName || context === component.nickName) {
                foundComponent = component;
                return true; // YOUR VISIT IS AT AN END!!
            }
            if (fluid.getForComponent(component, ["options", "components", context, "type"]) && !component[context]) {
  // This is an expensive guess since we make it for every component up the stack - must apply the WAVE OF EXPLOSION (FLUID-4925) to discover all components first
  // This line attempts a hopeful construction of components that could be guessed by nickname through finding them unconstructed
  // in options. In the near future we should eagerly BEGIN the process of constructing components, discovering their
  // types and then attaching them to the tree VERY EARLY so that we get consistent results from different strategies.
                foundComponent = fluid.getForComponent(component, context);
                return true;
            }
        });
        return foundComponent;
    };

    var localRecordExpected = /^(arguments|options|container|source|sourcePath|change)$/;

    // unsupported, NON-API function
    fluid.makeStackFetcher = function (parentThat, localRecord) {
        var fetcher = function (parsed) {
            if (parentThat && parentThat.destroy === fluid.destroyedMarker) {
                fluid.fail("Cannot resolve reference ", parsed, " from component " + fluid.dumpThat(parentThat) + " which has been destroyed");
            }
            var context = parsed.context;
            if (localRecord && localRecordExpected.test(context)) {
                var fetched = fluid.get(localRecord[context], parsed.path);
                return context === "arguments" || context === "source" || context === "sourcePath" || context === "change" ? fetched : {
                    marker: context === "options" ? fluid.EXPAND : fluid.EXPAND_NOW,
                    value: fetched
                };
            }
            var foundComponent = fluid.resolveContext(context, parentThat);
            if (!foundComponent && parsed.path !== "") {
                var ref = fluid.renderContextReference(parsed);
                fluid.fail("Failed to resolve reference " + ref + " - could not match context with name " +
                    context + " from component " + fluid.dumpThat(parentThat), parentThat);
            }
            return fluid.getForComponent(foundComponent, parsed.path);
        };
        return fetcher;
    };

    // unsupported, NON-API function
    fluid.makeStackResolverOptions = function (parentThat, localRecord) {
        return $.extend(fluid.copy(fluid.rawDefaults("fluid.makeExpandOptions")), {
            fetcher: fluid.makeStackFetcher(parentThat, localRecord),
            contextThat: parentThat
        });
    };

    // unsupported, non-API function
    fluid.clearListeners = function (shadow) {
        fluid.each(shadow.listeners, function (rec) {
            rec.event.removeListener(rec.listener);
        });
        delete shadow.listeners;
    };

    // unsupported, non-API function
    fluid.recordListener = function (event, listener, shadow) {
        if (event.ownerId !== shadow.that.id) { // don't bother recording listeners registered from this component itself
            var listeners = shadow.listeners;
            if (!listeners) {
                listeners = shadow.listeners = [];
            }
            listeners.push({event: event, listener: listener});
        }
    };

    var idToInstantiator = {};

    // unsupported, non-API function - however, this structure is of considerable interest to those debugging
    // into IoC issues. The structures idToShadow and pathToComponent contain a complete map of the component tree
    // forming the surrounding scope
    fluid.instantiator = function (freeInstantiator) {
        var that = {
            id: fluid.allocateGuid(),
            free: freeInstantiator,
            nickName: "instantiator",
            pathToComponent: {},
            idToShadow: {},
            modelTransactions: {init: {}}, // a map of transaction id to map of component id to records of components enlisted in a current model initialisation transaction
            composePath: fluid.composePath // For speed, we declare that no component's name may contain a period
        };
        // We frequently get requests for components not in this instantiator - e.g. from the dynamicEnvironment or manually created ones
        that.idToPath = function (id) {
            var shadow = that.idToShadow[id];
            return shadow ? shadow.path : "";
        };
        that.getThatStack = function (component) {
            var shadow = that.idToShadow[component.id];
            if (shadow) {
                var path = shadow.path;
                var parsed = fluid.model.parseEL(path);
                var togo = fluid.transform(parsed, function (value, i) {
                    var parentPath = fluid.model.composeSegments.apply(null, parsed.slice(0, i + 1));
                    return that.pathToComponent[parentPath];
                });
                var root = that.pathToComponent[""];
                if (root) {
                    togo.unshift(root);
                }
                return togo;
            }
            else { return [component];}
        };
        that.getEnvironmentalStack = function () {
            var togo = [fluid.staticEnvironment];
            if (!freeInstantiator) {
                togo.push(fluid.globalThreadLocal());
            }
            return togo;
        };
        that.getFullStack = function (component) {
            var thatStack = component? that.getThatStack(component) : [];
            return that.getEnvironmentalStack().concat(thatStack);
        };
        function recordComponent(component, path, created) {
            if (created) {
                idToInstantiator[component.id] = that;
                var shadow = that.idToShadow[component.id] = {};
                shadow.that = component;
                shadow.path = path;
            }
            if (that.pathToComponent[path]) {
                fluid.fail("Error during instantiation - path " + path + " which has just created component " + fluid.dumpThat(component) +
                    " has already been used for component " + fluid.dumpThat(that.pathToComponent[path]) + " - this is a circular instantiation or other oversight." +
                    " Please clear the component using instantiator.clearComponent() before reusing the path.");
            }
            that.pathToComponent[path] = component;
        }
        that.recordRoot = function (component) {
            if (component && component.id && !that.pathToComponent[""]) {
                recordComponent(component, "", true);
            }
        };
        that.recordKnownComponent = function (parent, component, name, created) {
            var parentPath = that.idToShadow[parent.id].path;
            var path = that.composePath(parentPath, name);
            recordComponent(component, path, created);
        };
        that.clearComponent = function (component, name, child, options, noModTree, path) {
            var record = that.idToShadow[component.id].path;
            // use flat recursion since we want to use our own recursion rather than rely on "visited" records
            options = options || {flat: true, instantiator: that};
            child = child || component[name];
            path = path || record;
            if (path === undefined) {
                fluid.fail("Cannot clear component " + name + " from component ", component,
                    " which was not created by this instantiator");
            }
            fluid.fireEvent(child, "events.onClear", [child, name, component]);

            var childPath = that.composePath(path, name);
            var childRecord = that.idToShadow[child.id];

            // only recurse on components which were created in place - if the id record disagrees with the
            // recurse path, it must have been injected
            if (childRecord && childRecord.path === childPath) {
                fluid.doDestroy(child, name, component);
                // TODO: There needs to be a call to fluid.clearDistributions here
                fluid.clearListeners(childRecord);
                fluid.visitComponentChildren(child, function(gchild, gchildname, newPath, parentPath) {
                    that.clearComponent(child, gchildname, null, options, true, parentPath);
                }, options, childPath);
                fluid.fireEvent(child, "events.afterDestroy", [child, name, component]);
                delete that.idToShadow[child.id];
                delete idToInstantiator[child.id];
            }
            delete that.pathToComponent[childPath]; // there may be no entry - if created informally
            if (!noModTree) {
                delete component[name]; // there may be no entry - if creation is not concluded
            }
        };
        return that;
    };

    // An instantiator to be used in the "free environment", unattached to any component tree
    fluid.freeInstantiator = fluid.instantiator(true);

    // Look up the globally registered instantiator for a particular component
    fluid.getInstantiator = function (component) {
        return component && idToInstantiator[component.id] || fluid.freeInstantiator;
    };

    /** Expand a set of component options either immediately, or with deferred effect.
     *  The current policy is to expand immediately function arguments within fluid.embodyDemands which are not the main options of a
     *  component. The component's own options take <code>{defer: true}</code> as part of
     *  <code>outerExpandOptions</code> which produces an "expandOptions" structure holding the "strategy" and "initter" pattern
     *  common to ginger participants.
     *  Probably not to be advertised as part of a public API, but is considerably more stable than most of the rest
     *  of the IoC API structure especially with respect to the first arguments.
     */

    fluid.expandOptions = function (args, that, mergePolicy, localRecord, outerExpandOptions) {
        if (!args) {
            return args;
        }
        fluid.pushActivity("expandOptions", "expanding options %args for component %that ", {that: that, args: args});
        var expandOptions = fluid.makeStackResolverOptions(that, localRecord);
        expandOptions.mergePolicy = mergePolicy;
        expandOptions.freeRoot = outerExpandOptions && outerExpandOptions.freeRoot;
        var expanded = outerExpandOptions && outerExpandOptions.defer ?
            fluid.makeExpandOptions(args, expandOptions) : fluid.expand(args, expandOptions);
        fluid.popActivity();
        return expanded;
    };

    // unsupported, non-API function
    fluid.localRecordExpected = ["type", "options", "args", "mergeOptions", "createOnEvent", "priority", "recordType"]; // last element unavoidably polluting
    // unsupported, non-API function
    fluid.checkComponentRecord = function (defaults, localRecord) {
        var expected = fluid.arrayToHash(fluid.localRecordExpected);
        fluid.each(defaults && defaults.argumentMap, function(value, key) {
            expected[key] = true;
        });
        fluid.each(localRecord, function (value, key) {
            if (!expected[key]) {
                fluid.fail("Probable error in subcomponent record - key \"" + key +
                    "\" found, where the only legal options are " +
                    fluid.keys(expected).join(", "));
            }
        });
    };

    // unsupported, non-API function
    fluid.pushDemands = function (list, demands) {
        demands = fluid.makeArray(demands);
        var thisp = fluid.mergeRecordTypes.demands;
        function push(rec) {
            rec.recordType = "demands";
            rec.priority = thisp++;
            list.push(rec);
        }
        function buildAndPush(rec) {
            push({options: rec});
        }
        // Assume these are sorted at source by intersect count (can't pre-merge if we want "mergeOptions")
        for (var i = 0; i < demands.length; ++ i) {
            var thisd = demands[i];
            if (thisd.options) {
                push(thisd);
            }
            else if (thisd.mergeOptions) {
                var mergeOptions = fluid.makeArray(thisd.mergeOptions);
                fluid.each(mergeOptions, buildAndPush);
            }
            else {
                fluid.fail("Uninterpretable demands record without options or mergeOptions ", thisd);
            }
        }
    };

    // unsupported, non-API function
    fluid.mergeRecordsToList = function (mergeRecords) {
        var list = [];
        fluid.each(mergeRecords, function (value, key) {
            value.recordType = key;
            if (key === "distributions") {
                list.push.apply(list, value);
            }
            else if (key !== "demands") {
                if (!value.options) { return; }
                value.priority = fluid.mergeRecordTypes[key];
                if (value.priority === undefined) {
                    fluid.fail("Merge record with unrecognised type " + key + ": ", value);
                }
                list.push(value);
            }
            else {
                fluid.pushDemands(list, value);
            }
        });
        return list;
    };

    // TODO: overall efficiency could huge be improved by resorting to the hated PROTOTYPALISM as an optimisation
    // for this mergePolicy which occurs in every component. Although it is a deep structure, the root keys are all we need
    var addPolicyBuiltins = function (policy) {
        fluid.each(["gradeNames", "mergePolicy", "argumentMap", "components", "dynamicComponents", "members", "invokers", "events", "listeners", "modelListeners", "distributeOptions", "transformOptions"], function (key) {
            fluid.set(policy, [key, "*", "noexpand"], true);
        });
        return policy;
    };

    // unsupported, NON-API function - used from Fluid.js
    fluid.generateExpandBlock = function (record, that, mergePolicy, localRecord) {
        var expanded = fluid.expandOptions(record.options, record.contextThat || that, mergePolicy, localRecord, {defer: true});
        expanded.priority = record.priority;
        expanded.recordType = record.recordType;
        return expanded;
    };

    var expandComponentOptionsImpl = function (mergePolicy, defaults, userOptions, that) {
        var defaultCopy = fluid.copy(defaults);
        addPolicyBuiltins(mergePolicy);
        var shadow = fluid.shadowForComponent(that);
        shadow.mergePolicy = mergePolicy;
        var mergeRecords = {
            defaults: {options: defaultCopy}
        };

        if (userOptions) {
            if (userOptions.marker === fluid.EXPAND) {
                $.extend(mergeRecords, userOptions.mergeRecords);
                // Do this here for gradeless components that were corrected by "localOptions"
                if (mergeRecords.subcomponentRecord) {
                    fluid.checkComponentRecord(defaults, mergeRecords.subcomponentRecord);
                }
            }
            else {
                mergeRecords.user = {options: fluid.expandCompact(userOptions, true)};
            }
        }
        var expandList = fluid.mergeRecordsToList(mergeRecords);

        var togo = fluid.transform(expandList, function (value) {
            return fluid.generateExpandBlock(value, that, mergePolicy, userOptions && userOptions.localRecord);
        });
        return togo;
    };

    // unsupported, non-API function
    fluid.makeIoCRootDestroy = function (instantiator, that) {
        return function () {
            instantiator.clearComponent(that, "", that, null, true);
            fluid.doDestroy(that);
            fluid.fireEvent(that, "events.afterDestroy", [that, "", null]);
        };
    };

    // unsupported, non-API function
    fluid.expandComponentOptions = function (mergePolicy, defaults, userOptions, that) {
        var instantiator = userOptions && userOptions.marker === fluid.EXPAND && userOptions.memberName !== undefined ?
            userOptions.instantiator : null;
        var fresh;
        if (!instantiator) {
            instantiator = fluid.instantiator();
            fresh = true;
            fluid.log("Created new instantiator with id " + instantiator.id + " in order to operate on component " + (that? that.typeName : "[none]"));
            that.destroy = fluid.makeIoCRootDestroy(instantiator, that);
        }
        fluid.pushActivity("expandComponentOptions", "expanding component options %options with record %record for component %that",
            {options: userOptions && userOptions.mergeRecords, record: userOptions, that: that});
        if (fresh) {
            instantiator.recordRoot(that);
        }
        else {
            instantiator.recordKnownComponent(userOptions.parentThat, that, userOptions.memberName, true);
        }
        var togo = expandComponentOptionsImpl(mergePolicy, defaults, userOptions, that);
        fluid.popActivity();
        return togo;
    };

    // unsupported, non-API function
    fluid.argMapToDemands = function (argMap) {
        var togo = [];
        fluid.each(argMap, function (value, key) {
            togo[value] = "{" + key + "}";
        });
        return togo;
    };

    // unsupported, non-API function
    fluid.makePassArgsSpec = function (initArgs) {
        return fluid.transform(initArgs, function(arg, index) {
            return "{arguments}." + index;
        });
    };

    // unsupported, NON-API function
    fluid.pushDemandSpec = function (record, options, mergeOptions) {
        if (options && options !== "{options}") {
            record.push({options: options});
        }
        if (mergeOptions) {
            record.push({mergeOptions: mergeOptions});
        }
    };

    /** Given a concrete argument list and/or options, determine the final concrete
     * "invocation specification" which is coded by the supplied demandspec in the
     * environment "thatStack" - the return is a package of concrete global function name
     * and argument list which is suitable to be executed directly by fluid.invokeGlobalFunction.
     */
    // unsupported, non-API function
    // options is just a disposition record containing memberName, componentRecord + passArgs
    // various built-in effects of this method
    // i) note that it makes no effort to actually propagate direct
    // options from "initArgs", assuming that they will be seen again in expandComponentOptions
    fluid.embodyDemands = function (parentThat, demandspec, initArgs, options) {
        options = options || {};

        if (demandspec.mergeOptions && demandspec.options) {
            fluid.fail("demandspec ", demandspec,
                    " is invalid - cannot specify literal options together with mergeOptions");
        }
        if (demandspec.transformOptions) { // Support for "transformOptions" at top level in a demands record
            demandspec.options = $.extend(true, {}, demandspec.options, {
                transformOptions: demandspec.transformOptions
            });
        }
        var demands = fluid.makeArray(demandspec.args);

        var upDefaults = fluid.defaults(demandspec.funcName);

        var fakeThat = {}; // fake "that" for receiveDistributions since we try to match selectors before creation for FLUID-5013
        var distributions = upDefaults && parentThat ? fluid.receiveDistributions(parentThat, upDefaults.gradeNames, options.memberName, fakeThat) : [];

        var argMap = upDefaults? upDefaults.argumentMap : null;
        var inferMap = false;
        if (upDefaults) {
            options.passArgs = false; // Don't attempt to construct a component using "passArgs" spec
        }
        if (!argMap && (upDefaults || (options && options.componentRecord))) {
            inferMap = true;
            // infer that it must be a little component if we have any reason to believe it is a component
            if (demands.length < 2) {
                argMap = fluid.rawDefaults("fluid.littleComponent").argumentMap;
            }
            else {
                var optionpos = $.inArray("{options}", demands);
                if (optionpos === -1) {
                    optionpos = demands.length - 1; // wild guess in the old style
                }
                argMap = {options: optionpos};
            }
        }
        options = options || {};
        if (demands.length === 0) {
            if (argMap) {
                demands = fluid.argMapToDemands(argMap);
            }
            else if (options.passArgs) {
                demands = fluid.makePassArgsSpec(initArgs);
            }
        }
        var shadow = fluid.shadowForComponent(parentThat);
        var localDynamic = shadow && options.memberName ? shadow.subcomponentLocal[options.memberName] : null;

        // confusion remains with "localRecord" - it is a random mishmash of user arguments and the component record
        // this should itself be absorbed into "mergeRecords" and let stackFetcher sort it out
        var localRecord = $.extend({"arguments": initArgs}, fluid.censorKeys(options.componentRecord, ["type"]), localDynamic);

        fluid.each(argMap, function (index, name) {
            // this is incorrect anyway! What if the supplied arguments were not in the same order as the target argmap,
            // which was obtained from the target defaults
            if (initArgs.length > 0) {
                localRecord[name] = localRecord["arguments"][index];
            }
            if (demandspec[name] !== undefined && localRecord[name] === undefined) {
                localRecord[name] = demandspec[name];
            }
            if (name !== "options") {
                for (var i = 0; i < distributions.length; ++ i) { // Apply non-options material from distributions (FLUID-5013)
                    if (distributions[i][name] !== undefined) {
                        localRecord[name] = distributions[i][name];
                    }
                }
            }
        });
        var i;
        for (i = 0; i < distributions.length; ++ i) {
            if (distributions[i].type !== undefined) {
                demandspec.funcName = distributions[i].type;
            }
        }

        var mergeRecords = {distributions: distributions};

        if (options.componentRecord !== undefined) {
            // Deliberately put too many things here so they can be checked in expandComponentOptions (FLUID-4285)
            mergeRecords.subcomponentRecord = $.extend({}, options.componentRecord);
        }
        var expandOptions = fluid.makeStackResolverOptions(parentThat, localRecord);
        var pushBackSpec = function (backSpec) {
            fluid.pushDemandSpec(mergeRecords.demands, backSpec.options, backSpec.mergeOptions);
        };
        var args = [];
        if (demands) {
            for (i = 0; i < demands.length; ++i) {
                var arg = demands[i];
                // Weak detection since we cannot guarantee this material has not been copied
                if (fluid.isMarker(arg) && arg.value === fluid.COMPONENT_OPTIONS.value) {
                    arg = "{options}";
                    // Backwards compatibility for non-users of GRADES - last-ditch chance to correct the inference
                    if (inferMap) {
                        argMap = {options: i};
                    }
                }
                if (typeof(arg) === "string") {
                    if (arg.charAt(0) === "@") {
                        var argpos = arg.substring(1);
                        arg = "{arguments}." + argpos;
                    }
                }
                demands[i] = arg;
                if (!argMap || argMap.options !== i) {
                    // expand immediately if there can be no options or this is not the options
                    args[i] = fluid.expand(arg, expandOptions);
                }
                else { // It is the component options
                    if (options.passArgs) {
                        fluid.fail("Error invoking function " + demandspec.funcName + ": found component creator rather than free function");
                    }
                    if (typeof(arg) === "object" && !arg.targetTypeName) {
                        arg.targetTypeName = demandspec.funcName;
                    }
                    mergeRecords.demands = [];
                    fluid.each((demandspec.backSpecs).reverse(), pushBackSpec);
                    fluid.pushDemandSpec(mergeRecords.demands, demandspec.options || arg, demandspec.mergeOptions);
                    if (initArgs.length > 0) {
                        mergeRecords.user = {options: localRecord.options};
                    }
                    args[i] = {marker: fluid.EXPAND,
                               localRecord: localDynamic,
                               mergeRecords: mergeRecords,
                               instantiator: fluid.getInstantiator(parentThat),
                               parentThat: parentThat,
                               memberName: options.memberName};
                }
                if (args[i] && fluid.isMarker(args[i].marker, fluid.EXPAND_NOW)) {
                    args[i] = fluid.expand(args[i].value, expandOptions);
                }
            }
        }
        else {
            args = initArgs? initArgs : [];
        }

        var togo = {
            args: args,
            preExpand: demands,
            funcName: demandspec.funcName
        };
        return togo;
    };

    // NON-API function
    fluid.fabricateDestroyMethod = function (that, name, instantiator, child) {
        return function () {
            instantiator.clearComponent(that, name, child);
        };
    };

    /** Instantiate the subcomponent with the supplied name of the supplied top-level component. Although this method
     * is published as part of the Fluid API, it should not be called by general users and may not remain stable. It is
     * currently the only mechanism provided for instantiating components whose definitions are dynamic, and will be
     * replaced in time by dedicated declarative framework described by FLUID-5022.
     * @param that {Component} the parent component for which the subcomponent is to be instantiated
     * @param name {String} the name of the component - the index of the options block which configures it as part of the
     * <code>components</code> section of its parent's options
     */
     // NB "directArgs" is now disused by the framework

    fluid.initDependent = function (that, name, directArgs) {
        if (that[name]) { return; } // TODO: move this into strategy
        directArgs = directArgs || [];
        var component = that.options.components[name];
        fluid.pushActivity("initDependent", "instantiating dependent component with name \"%name\" with record %record as child of %parent",
            {name: name, record: component, parent: that});
        var instance;
        var instantiator = idToInstantiator[that.id];

        if (typeof(component) === "string") {
            instance = fluid.expandOptions(component, that);
            instantiator.recordKnownComponent(that, instance, name, false);
        }
        else if (component.type) {
            var type = fluid.expandOptions(component.type, that);
            if (!type) {
                fluid.fail("Error in subcomponent record: ", component.type, " could not be resolved to a type for component ", name,
                    " of parent ", that);
            }
            var invokeSpec = fluid.resolveDemands(that, [type, name], directArgs,
                {componentRecord: component, memberName: name});
            instance = fluid.initSubcomponentImpl(that, {type: invokeSpec.funcName}, invokeSpec.args);
            // The existing instantiator record will be provisional, adjust it to take account of the true return
            // TODO: Instantiator contents are generally extremely incomplete
            var path = instantiator.composePath(instantiator.idToPath(that.id), name);
            var existing = instantiator.pathToComponent[path];
            // This branch deals with the case where the component creator registered a component into "pathToComponent"
            // that does not agree with the component which was the return value. We need to clear out "pathToComponent" but
            // not shred the component since most of it is probably still valid
            if (existing && existing !== instance) {
                instantiator.clearComponent(that, name, existing);
            }
            if (instance && instance.typeName && instance.id && instance !== existing) {
                instantiator.recordKnownComponent(that, instance, name, true);
            }
            instance.destroy = fluid.fabricateDestroyMethod(that, name, instantiator, instance);
        }
        else {
            fluid.fail("Unrecognised material in place of subcomponent " + name + " - no \"type\" field found");
        }
        that[name] = instance;
        fluid.fireEvent(instance, "events.onAttach", [instance, name, that]);
        fluid.popActivity();
        return instance;
    };

    // unsupported, non-API function
    fluid.bindDeferredComponent = function (that, componentName, component) {
        var events = fluid.makeArray(component.createOnEvent);
        fluid.each(events, function(eventName) {
            var event = eventName.charAt(0) === "{" ? fluid.expandOptions(eventName, that) : that.events[eventName];
            event.addListener(function () {
                fluid.pushActivity("initDeferred", "instantiating deferred component %componentName of parent %that due to event %eventName",
                 {componentName: componentName, that: that, eventName: eventName});
                if (that[componentName]) {
                    var instantiator = idToInstantiator[that.id];
                    instantiator.clearComponent(that, componentName);
                }
                fluid.initDependent(that, componentName);
                fluid.popActivity();
            }, null, null, component.priority);
        });
    };

    // unsupported, non-API function
    fluid.priorityForComponent = function (component) {
        return component.priority? component.priority :
            (component.type === "fluid.typeFount" || fluid.hasGrade(fluid.defaults(component.type), "fluid.typeFount"))?
            "first" : undefined;
    };

    fluid.initDependents = function (that) {
        fluid.pushActivity("initDependents", "instantiating dependent components for component %that", {that: that});
        var shadow = fluid.shadowForComponent(that);
        shadow.memberStrategy.initter();

        var options = that.options;
        var components = options.components || {};
        var componentSort = {};

        fluid.each(components, function (component, name) {
            if (!component.createOnEvent) {
                var priority = fluid.priorityForComponent(component);
                componentSort[name] = {key: name, priority: fluid.event.mapPriority(priority, 0)};
            }
            else {
                fluid.bindDeferredComponent(that, name, component);
            }
        });
        var componentList = fluid.event.sortListeners(componentSort);
        fluid.each(componentList, function (entry) {
            fluid.initDependent(that, entry.key);
        });

        shadow.invokerStrategy.initter();
        fluid.popActivity();
    };

    var dependentStore = {};

    function searchDemands (demandingName, contextNames) {
        var exist = dependentStore[demandingName] || [];
outer:  for (var i = 0; i < exist.length; ++i) {
            var rec = exist[i];
            for (var j = 0; j < contextNames.length; ++j) {
                if (rec.contexts[j] !== contextNames[j]) {
                    continue outer;
                }
            }
            return rec.spec; // jslint:ok
        }
    }

    var isDemandLogging = false;
    fluid.setDemandLogging = function (set) {
        isDemandLogging = set;
    };

    // unsupported, non-API function
    fluid.isDemandLogging = function () {
        return isDemandLogging && fluid.isLogging();
    };

    fluid.demands = function (demandingName, contextName, spec) {
        var contextNames = fluid.makeArray(contextName).sort();
        if (!spec) {
            return searchDemands(demandingName, contextNames);
        }
        else if (spec.length) {
            spec = {args: spec};
        }
        if (fluid.getCallerInfo && fluid.isDemandLogging()) {
            var callerInfo = fluid.getCallerInfo(5);
            if (callerInfo) {
                spec.registeredFrom = callerInfo;
            }
        }
        spec.demandId = fluid.allocateGuid();
        var exist = dependentStore[demandingName];
        if (!exist) {
            exist = [];
            dependentStore[demandingName] = exist;
        }
        exist.push({contexts: contextNames, spec: spec});
    };

    // unsupported, non-API function
    fluid.compareDemands = function (speca, specb) {
        return specb.intersect - speca.intersect;
    };

    // unsupported, non-API function
    fluid.locateAllDemands = function (parentThat, demandingNames) {
        var demandLogging = fluid.isDemandLogging(demandingNames);
        if (demandLogging) {
            fluid.log("Resolving demands for function names ", demandingNames, " in context of " +
                (parentThat? "component " + parentThat.typeName : "no component"));
        }

        var contextNames = {};
        var visited = [];
        var instantiator = fluid.getInstantiator(parentThat);
        var thatStack = instantiator.getFullStack(parentThat);
        visitComponents(instantiator, thatStack, function (component, xname, path, xpath, depth) {
            // NB - don't use shadow's cache here because we allow fewer names for demand resolution than for value resolution
            contextNames[component.typeName] = depth;
            var gradeNames = fluid.makeArray(fluid.get(component, ["options", "gradeNames"]));
            fluid.each(gradeNames, function (gradeName) {
                contextNames[gradeName] = depth;
            });
            visited.push(component);
        });
        if (demandLogging) {
            fluid.log("Components in scope for resolution:\n" + fluid.dumpThatStack(visited, instantiator));
        }
        var matches = [];
        for (var i = 0; i < demandingNames.length; ++i) {
            var rec = dependentStore[demandingNames[i]] || [];
            for (var j = 0; j < rec.length; ++j) {
                var spec = rec[j];
                var horizonLevel = spec.spec.horizon ? contextNames[spec.spec.horizon] : -1;
                var record = {spec: spec, intersect: 0, uncess: 0};
                for (var k = 0; k < spec.contexts.length; ++k) {
                    var depth = contextNames[spec.contexts[k]];
                    record[depth !== undefined && depth >= horizonLevel ? "intersect" : "uncess"] += 2;
                }
                if (spec.contexts.length === 0) { // allow weak priority for contextless matches
                    record.intersect++;
                }
                if (record.uncess === 0) {
                    matches.push(record);
                }
            }
        }
        matches.sort(fluid.compareDemands);
        return matches;
    };

    // unsupported, non-API function
    fluid.locateDemands = function (parentThat, demandingNames) {
        var matches = fluid.locateAllDemands(parentThat, demandingNames);
        var demandspec = fluid.getMembers(matches, ["spec", "spec"]);
        if (fluid.isDemandLogging(demandingNames)) {
            if (demandspec.length) {
                fluid.log("Located " + matches.length + " potential match" + (matches.length === 1? "" : "es") + ", selected best match with " + matches[0].intersect +
                    " matched context names: ", demandspec);
            }
            else {
                fluid.log("No matches found for demands, using direct implementation");
            }
        }
        return demandspec;
    };

    /** Determine the appropriate demand specification held in the fluid.demands environment
     * relative the supplied component position for the function name(s) funcNames.
     */
    // unsupported, non-API function
    fluid.determineDemands = function (parentThat, funcNames) {
        funcNames = fluid.makeArray(funcNames);
        var newFuncName = funcNames[0];
        var demandspec = fluid.locateDemands(parentThat, funcNames);
        if (demandspec.length && demandspec[0].funcName) {
            newFuncName = demandspec[0].funcName;
        }

        return $.extend(true, {funcName: newFuncName,
                                args: demandspec[0] ? fluid.makeArray(demandspec[0].args) : []
                                },
                                { backSpecs: demandspec.slice(1) }, // Fix for FLUID-5126
            fluid.censorKeys(demandspec[0], ["funcName", "args"]));
    };
    // "options" includes - passArgs, componentRecord, memberName (latter two from initDependent route)
    // unsupported, non-API function
    fluid.resolveDemands = function (parentThat, funcNames, initArgs, options) {
        var demandspec = fluid.determineDemands(parentThat, funcNames);
        return fluid.embodyDemands(parentThat, demandspec, initArgs, options);
    };

    // unsupported, non-API function
    fluid.thisistToApplicable = function (record, recthis, that) {
        return {
            apply: function (noThis, args) {
                // Resolve this material late, to deal with cases where the target has only just been brought into existence
                // (e.g. a jQuery target for rendered material) - TODO: Possibly implement cached versions of these as we might do for invokers
                var resolvedThis = fluid.expandOptions(recthis, that);
                if (typeof(resolvedThis) === "string") {
                    resolvedThis = fluid.getGlobalValue(resolvedThis);
                }
                if (!resolvedThis) {
                    fluid.fail("Could not resolve reference " + recthis + " to a value");
                }
                var resolvedFunc = resolvedThis[record.method];
                if (typeof(resolvedFunc) !== "function") {
                    fluid.fail("Object ", resolvedThis, " at reference " + recthis + " has no member named " + record.method + " which is a function ");
                }
                fluid.log("Applying arguments ", args, " to method " + record.method + " of instance ", resolvedThis);
                return resolvedFunc.apply(resolvedThis, args);
            }
        };
    };

    fluid.changeToApplicable = function (record, that) {
        return {
            apply: function (noThis, args) {
                var parsed = fluid.parseValidModelReference(that, "changePath listener record", record.changePath);
                var value = fluid.expandOptions(record.value, that, {}, {"arguments": args});
                fluid.fireSourcedChange(parsed.applier, parsed.path, value, record.source);
            }
        };
    };

    // Convert "exotic records" into an applicable form ("this/method" for FLUID-4878 or "changePath" for FLUID-3674)
    // unsupported, non-API function
    fluid.recordToApplicable = function (record, that) {
        if (record.changePath) {
            return fluid.changeToApplicable(record, that);
        }
        var recthis = record["this"];
        if (record.method ^ recthis) {
            fluid.fail("Record ", that, " must contain both entries \"method\" and \"this\" if it contains either");
        }
        return record.method ? fluid.thisistToApplicable(record, recthis, that) : null;
    };

    // TODO: make a *slightly* more performant version of fluid.invoke that perhaps caches the demands
    // after the first successful invocation
    fluid.invoke = function (functionName, args, that, environment) {
        fluid.pushActivity("invokeFunc", "invoking function with name \"%functionName\" from component %that", {functionName: functionName, that: that});
        var invokeSpec = fluid.resolveDemands(that, functionName, fluid.makeArray(args), {passArgs: true});
        var togo = fluid.invokeGlobalFunction(invokeSpec.funcName, invokeSpec.args, environment);
        fluid.popActivity();
        return togo;
    };

    /** Make a function which performs only "static redispatch" of the supplied function name -
     * that is, taking only account of the contents of the "static environment". Since the static
     * environment is assumed to be constant, the dispatch of the call will be evaluated at the
     * time this call is made, as an optimisation.
     */
    // unsupported, non-API function
    fluid.makeFreeInvoker = function (functionName, environment) {
        var demandSpec = fluid.determineDemands(null, functionName);
        return function () {
            var invokeSpec = fluid.embodyDemands(null, demandSpec, fluid.makeArray(arguments), {passArgs: true});
            return fluid.invokeGlobalFunction(invokeSpec.funcName, invokeSpec.args, environment);
        };
    };

    var argPrefix = "{arguments}.";

    fluid.parseInteger = function (string) {
        return isFinite(string) && ((string % 1) === 0) ? Number(string) : NaN;
    };

    fluid.makeFastInvoker = function (invokeSpec, func) {
        var argMap;
        if (invokeSpec.preExpand) {
            argMap = {};
            for (var i = 0; i < invokeSpec.preExpand.length; ++ i) {
                var value = invokeSpec.preExpand[i];
                if (typeof(value) === "string") {
                    if (value.indexOf("}.model") !== -1) {
                        return {noFast: true};
                    }
                    if (value === "{arguments}") {
                        argMap[i] = "*";
                    } else if (value.indexOf(argPrefix) === 0) {
                        var argIndex = fluid.parseInteger(value.substring(argPrefix.length));
                        if (isNaN(argIndex)) {
                            return {noFast: true};
                        }
                        else {
                            argMap[i] = argIndex; // target arg pos = original arg pos
                        }
                    }
                }
            }
        }
        var outArgs = invokeSpec.args;
        var invoke = argMap ? function invoke(args) {
            for (var i in argMap) {
                outArgs[i] = argMap[i] === "*" ? args : args[argMap[i]];
            }
            return func.apply(null, outArgs);
        } : function invoke (args) {
            return func.apply(null, args);
        };
        return {
            invoke: invoke
        };
    };

    // unsupported, non-API function
    fluid.makeInvoker = function (that, invokerec, name, environment) {
        var functionName;
        if (typeof(invokerec) === "string") {
            if (invokerec.charAt(0) === "{") { // shorthand case for direct function invokers (FLUID-4926)
                invokerec = {func: invokerec};
            } else {
                functionName = invokerec;
            }
        }
        var demandspec = functionName? fluid.determineDemands(that, functionName) : invokerec;
        var fastRec = {noFast: invokerec.dynamic};
        return function invokeInvoker () {
            if (fluid.defeatLogging === false) {
                fluid.pushActivity("invokeInvoker", "invoking invoker with name %name and record %record from component %that", {name: name, record: invokerec, that: that});
            }
            var togo;
            if (fastRec.invoke) {
                togo = fastRec.invoke(arguments);
            }
            else {
                var func = fluid.recordToApplicable(invokerec, that);
                var args = fluid.makeArray(arguments);
                var invokeSpec = fluid.embodyDemands(that, demandspec, args, {passArgs: true});
                func = func || (invokeSpec.funcName? fluid.getGlobalValue(invokeSpec.funcName, environment)
                    : fluid.expandOptions(demandspec.func, that));
                if (!func || !func.apply) {
                    fluid.fail("Error in invoker record: could not resolve members func, funcName or method to a function implementation - got " + func + " from ", demandspec);
                }
                if (fastRec.noFast !== true) {
                    fastRec = fluid.makeFastInvoker(invokeSpec, func);
                }
                togo = func.apply(null, invokeSpec.args);
            }
            if (fluid.defeatLogging === false) {
                fluid.popActivity();
            }
            return togo;
        };
    };

    // unsupported, non-API function
    // weird higher-order function so that we can staightforwardly dispatch original args back onto listener
    fluid.event.makeTrackedListenerAdder = function (source) {
        var shadow = fluid.shadowForComponent(source);
        return function (event) {
            return {addListener: function (listener) {
                    fluid.recordListener(event, listener, shadow);
                    event.addListener.apply(null, arguments);
                }
            };
        };
    };

    // unsupported, non-API function
    fluid.event.listenerEngine = function (eventSpec, callback, adder) {
        var argstruc = {};
        function checkFire() {
            var notall = fluid.find(eventSpec, function(value, key) {
                if (argstruc[key] === undefined) {
                    return true;
                }
            });
            if (!notall) {
                var oldstruc = argstruc;
                argstruc = {}; // guard against the case the callback perversely fires one of its prerequisites (FLUID-5112)
                callback(oldstruc);
            }
        }
        fluid.each(eventSpec, function (event, eventName) {
            adder(event).addListener(function () {
                argstruc[eventName] = fluid.makeArray(arguments);
                checkFire();
            });
        });
    };

    // unsupported, non-API function
    fluid.event.dispatchListener = function (that, listener, eventName, eventSpec, indirectArgs) {
        var togo = function () {
            fluid.pushActivity("dispatchListener", "firing to listener to event named %eventName of component %that",
                {eventName: eventName, that: that});

            var args = indirectArgs? arguments[0] : fluid.makeArray(arguments);
            var demandspec = fluid.determineDemands(that, eventName); // TODO: This name may contain a namespace
            if (demandspec.args.length === 0 && eventSpec.args) {
                demandspec.args = eventSpec.args;
            }
            // TODO: create a "fast path" here as for invokers. Eliminate redundancy with invoker code
            var resolved = fluid.embodyDemands(that, demandspec, args, {passArgs: true});
            var togo = fluid.event.invokeListener(listener, resolved.args);
            fluid.popActivity();
            return togo;
        };
        fluid.event.impersonateListener(listener, togo);
        return togo;
    };

    // unsupported, non-API function
    fluid.event.resolveSoftNamespace = function (key) {
        if (typeof(key) !== "string") {
            return null;
        } else {
            var lastpos = Math.max(key.lastIndexOf("."), key.lastIndexOf("}"));
            return key.substring(lastpos + 1);
        }
    };

    // unsupported, non-API function
    fluid.event.resolveListenerRecord = function (lisrec, that, eventName, namespace, standard) {
        var badRec = function (record, extra) {
            fluid.fail("Error in listener record - could not resolve reference ", record, " to a listener or firer. " +
                "Did you miss out \"events.\" when referring to an event firer?" + extra);
        };
        fluid.pushActivity("resolveListenerRecord", "resolving listener record for event named %eventName for component %that",
            {eventName: eventName, that: that});
        var records = fluid.makeArray(lisrec);
        var transRecs = fluid.transform(records, function (record) {
            // TODO: FLUID-5242 fix - we copy here since distributeOptions does not copy options blocks that it distributes and we can hence corrupt them.
            // need to clarify policy on options sharing - for slightly better efficiency, copy should happen during distribution and not here
            var expanded = fluid.isPrimitive(record) || record.expander ? {listener: record} : fluid.copy(record);
            var methodist = fluid.recordToApplicable(record, that);
            if (methodist) {
                expanded.listener = methodist;
            }
            else {
                expanded.listener = expanded.listener || expanded.func || expanded.funcName;
            }
            if (!expanded.listener) {
                badRec(record, " Listener record must contain a member named \"listener\", \"func\", \"funcName\" or \"method\"");
            }
            var softNamespace = record.method ?
                fluid.event.resolveSoftNamespace(record["this"]) + "." + record.method :
                fluid.event.resolveSoftNamespace(expanded.listener);
            if (!expanded.namespace && !namespace && softNamespace) {
                expanded.softNamespace = true;
                expanded.namespace = (record.componentSource ? record.componentSource : that.typeName) + "." + softNamespace;
            }
            var listener = expanded.listener = fluid.expandOptions(expanded.listener, that);
            if (!listener) {
                badRec(record, "");
            }
            var firer = false;
            if (listener.typeName === "fluid.event.firer") {
                listener = listener.fire;
                firer = true;
            }
            expanded.listener = (standard && (expanded.args || firer)) ? fluid.event.dispatchListener(that, listener, eventName, expanded) : listener;
            return expanded;
        });
        var togo = {
            records: transRecs,
            adderWrapper: standard ? fluid.event.makeTrackedListenerAdder(that) : null
        };
        fluid.popActivity();
        return togo;
    };

    // unsupported, non-API function
    fluid.event.expandOneEvent = function (that, event) {
        var origin;
        if (typeof(event) === "string" && event.charAt(0) !== "{") {
            // Shorthand for resolving onto our own events, but with GINGER WORLD!
            origin = fluid.getForComponent(that, ["events", event]);
        }
        else {
            origin = fluid.expandOptions(event, that);
        }
        if (!origin || origin.typeName !== "fluid.event.firer") {
            fluid.fail("Error in event specification - could not resolve base event reference ", event, " to an event firer: got ", origin);
        }
        return origin;
    };

    // unsupported, non-API function
    fluid.event.expandEvents = function (that, event) {
        return typeof(event) === "string" ?
            fluid.event.expandOneEvent(that, event) :
            fluid.transform(event, function (oneEvent) {
                return fluid.event.expandOneEvent(that, oneEvent);
            });
    };

    // unsupported, non-API function
    fluid.event.resolveEvent = function (that, eventName, eventSpec) {
        fluid.pushActivity("resolveEvent", "resolving event with name %eventName attached to component %that",
            {eventName: eventName, that: that});
        var adder = fluid.event.makeTrackedListenerAdder(that);
        if (typeof(eventSpec) === "string") {
            eventSpec = {event: eventSpec};
        }
        var event = eventSpec.event || eventSpec.events;
        if (!event) {
            fluid.fail("Event specification for event with name " + eventName + " does not include a base event specification: ", eventSpec);
        }

        var origin = fluid.event.expandEvents(that, event);

        var isMultiple = origin.typeName !== "fluid.event.firer";
        var isComposite = eventSpec.args || isMultiple;
        // If "event" is not composite, we want to share the listener list and FIRE method with the original
        // If "event" is composite, we need to create a new firer. "composite" includes case where any boiling
        // occurred - this was implemented wrongly in 1.4.
        var firer;
        if (isComposite) {
            firer = fluid.makeEventFirer(null, null, " [composite] " + fluid.event.nameEvent(that, eventName));
            var dispatcher = fluid.event.dispatchListener(that, firer.fire, eventName, eventSpec, isMultiple);
            if (isMultiple) {
                fluid.event.listenerEngine(origin, dispatcher, adder);
            }
            else {
                adder(origin).addListener(dispatcher);
            }
        }
        else {
            firer = {typeName: "fluid.event.firer"}; // jslint:ok - already defined
            firer.fire = function () {
                var outerArgs = fluid.makeArray(arguments);
                fluid.pushActivity("fireSynthetic", "firing synthetic event %eventName ", {eventName: eventName});
                var togo = origin.fire.apply(null, outerArgs);
                fluid.popActivity();
                return togo;
            };
            firer.addListener = function (listener, namespace, predicate, priority, softNamespace) {
                var dispatcher = fluid.event.dispatchListener(that, listener, eventName, eventSpec);
                adder(origin).addListener(dispatcher, namespace, predicate, priority, softNamespace);
            };
            firer.removeListener = function (listener) {
                origin.removeListener(listener);
            };
        }
        fluid.popActivity();
        return firer;
    };

    /** BEGIN unofficial IoC material **/
    // Although the following three functions are unsupported and not part of the IoC
    // implementation proper, they are still used in the renderer
    // expander as well as in some old-style tests and various places in CSpace.

    // unsupported, non-API function
    fluid.withEnvironment = function (envAdd, func, root) {
        root = root || fluid.globalThreadLocal();
        return fluid.tryCatch(function() {
            for (var key in envAdd) {
                root[key] = envAdd[key];
            }
            $.extend(root, envAdd);
            return func();
        }, null, function() {
            for (var key in envAdd) { // jslint:ok duplicate "value"
                delete root[key]; // TODO: users may want a recursive "scoping" model
            }
        });
    };

    // unsupported, NON-API function
    fluid.fetchContextReference = function (parsed, directModel, env, elResolver, externalFetcher) {
        // The "elResolver" is a hack to make certain common idioms in protoTrees work correctly, where a contextualised EL
        // path actually resolves onto a further EL reference rather than directly onto a value target
        if (elResolver) {
            parsed = elResolver(parsed, env);
        }
        var base = parsed.context? env[parsed.context] : directModel;
        if (!base) {
            var resolveExternal = externalFetcher && externalFetcher(parsed);
            return resolveExternal || base;
        }
        return parsed.noDereference? parsed.path : fluid.get(base, parsed.path);
    };

    // unsupported, non-API function
    fluid.makeEnvironmentFetcher = function (directModel, elResolver, envGetter, externalFetcher) {
        envGetter = envGetter || fluid.globalThreadLocal;
        return function(parsed) {
            var env = envGetter();
            return fluid.fetchContextReference(parsed, directModel, env, elResolver, externalFetcher);
        };
    };

    /** END of unofficial IoC material **/

    // unsupported, non-API function
    fluid.coerceToPrimitive = function (string) {
        return string === "false" ? false : (string === "true" ? true :
            (isFinite(string) ? Number(string) : string));
    };

    // unsupported, non-API function
    fluid.compactStringToRec = function (string, type) {
        var openPos = string.indexOf("(");
        var closePos = string.indexOf(")");
        if (openPos === -1 ^ closePos === -1 || openPos > closePos) {
            fluid.fail("Badly-formed compact " + type + " record without matching parentheses: ", string);
        }
        if (openPos !== -1 && closePos !== -1) {
            var prefix = string.substring(0, openPos);
            var body = string.substring(openPos + 1, closePos);
            var args = fluid.transform(body.split(","), $.trim, fluid.coerceToPrimitive);
            var togo = {
                args: args
            };
            if (type === "invoker" && prefix.charAt(openPos - 1) === "!") {
                prefix = string.substring(0, openPos - 1);
                togo.dynamic = true;
            }
            togo[prefix.charAt(0) === "{" ? "func" : "funcName"] = prefix;
            return togo;
        }
        else if (type === "expander") {
            fluid.fail("Badly-formed compact expander record without parentheses: ", string);
        }
        return string;
    };

    fluid.expandPrefix = "@expand:";
    // unsupported, non-API function
    fluid.expandCompactString = function (string, active) {
        var rec = string;
        if (string.indexOf(fluid.expandPrefix) === 0) {
            var rem = string.substring(fluid.expandPrefix.length);
            rec = {
                expander: fluid.compactStringToRec(rem, "expander")
            };
        }
        else if (active) {
            rec = fluid.compactStringToRec(string, active);
        }
        return rec;
    };

    var singularPenRecord = {
        listeners: "listener",
        modelListeners: "modelListener"
    };

    var singularRecord = $.extend({
        invokers: "invoker"
    }, singularPenRecord);

    // unsupported, non-API function
    fluid.expandCompactRec = function (segs, target, source, userOptions) {
        var pen = segs.length > 0 ? segs[segs.length - 1] : "";
        var active = singularRecord[pen];
        if (!active && segs.length > 1) {
            active = singularPenRecord[segs[segs.length - 2]]; // support array of listeners and modelListeners
        }
        fluid.each(source, function (value, key) {
            // TODO: hack here to avoid corrupting old-style model references which were listed with "preserve" - eliminate this along with that mergePolicy
            if (fluid.isPlainObject(value) && !fluid.isDOMish(value) && !(userOptions && key === "model" && segs.length === 0)) {
                target[key] = fluid.freshContainer(value);
                segs.push(key);
                fluid.expandCompactRec(segs, target[key], value);
                segs.pop();
                return;
            }
            else if (typeof(value) === "string") {
                value = fluid.expandCompactString(value, active);
            }
            target[key] = value;
        });
    };

    // unsupported, non-API function
    fluid.expandCompact = function (options, userOptions) {
        var togo = {};
        fluid.expandCompactRec([], togo, options, userOptions);
        return togo;
    };

    // unsupported, non-API function
    fluid.extractEL = function (string, options) {
        if (options.ELstyle === "ALL") {
            return string;
        }
        else if (options.ELstyle.length === 1) {
            if (string.charAt(0) === options.ELstyle) {
                return string.substring(1);
            }
        }
        else if (options.ELstyle === "${}") {
            var i1 = string.indexOf("${");
            var i2 = string.lastIndexOf("}");
            if (i1 === 0 && i2 !== -1) {
                return string.substring(2, i2);
            }
        }
    };

    // unsupported, non-API function
    fluid.extractELWithContext = function (string, options) {
        var EL = fluid.extractEL(string, options);
        if (EL && EL.charAt(0) === "{" && EL.indexOf("}") > 0) {
            return fluid.parseContextReference(EL);
        }
        return EL? {path: EL} : EL;
    };

    fluid.parseContextReference = function (reference, index, delimiter) {
        index = index || 0;
        var endcpos = reference.indexOf("}", index + 1);
        if (endcpos === -1) {
            fluid.fail("Cannot parse context reference \"" + reference + "\": Malformed context reference without }");
        }
        var context = reference.substring(index + 1, endcpos);
        var endpos = delimiter? reference.indexOf(delimiter, endcpos + 1) : reference.length;
        var path = reference.substring(endcpos + 1, endpos);
        if (path.charAt(0) === ".") {
            path = path.substring(1);
        }
        return {context: context, path: path, endpos: endpos};
    };

    fluid.renderContextReference = function (parsed) {
        return "{" + parsed.context + "}." + parsed.path;
    };

    // unsupported, non-API function
    fluid.resolveContextValue = function (string, options) {
        function fetch(parsed) {
            fluid.pushActivity("resolveContextValue", "resolving context value %string", {string: string});
            var togo = options.fetcher(parsed);
            fluid.pushActivity("resolvedContextValue", "resolved value %string to value %value", {string: string, value: togo});
            fluid.popActivity(2);
            return togo;
        }
        var parsed;
        if (options.bareContextRefs && string.charAt(0) === "{" && string.indexOf("}") > 0) {
            parsed = fluid.parseContextReference(string);
            return fetch(parsed);
        }
        else if (options.ELstyle && options.ELstyle !== "${}") {
            parsed = fluid.extractELWithContext(string, options);
            if (parsed) {
                return fetch(parsed);
            }
        }
        while (typeof(string) === "string") {
            var i1 = string.indexOf("${");
            var i2 = string.indexOf("}", i1 + 2);
            if (i1 !== -1 && i2 !== -1) {
                if (string.charAt(i1 + 2) === "{") {
                    parsed = fluid.parseContextReference(string, i1 + 2, "}");
                    i2 = parsed.endpos;
                }
                else {
                    parsed = {path: string.substring(i1 + 2, i2)};
                }
                var subs = fetch(parsed);
                var all = (i1 === 0 && i2 === string.length - 1);
                // TODO: test case for all undefined substitution
                if (subs === undefined || subs === null) {
                    return subs;
                }
                string = all? subs : string.substring(0, i1) + subs + string.substring(i2 + 1);
            }
            else {
                break;
            }
        }
        return string;
    };

    // unsupported, NON-API function
    fluid.expandExpander = function (target, source, options) {
        var expander = fluid.getGlobalValue(source.expander.type || "fluid.deferredInvokeCall");
        if (expander) {
            return expander.call(null, target, source, options);
        }
    };

    // This function appears somewhat reusable, but not entirely - it probably needs to be packaged
    // along with the particular "strategy". Very similar to the old "filter"... the "outer driver" needs
    // to execute it to get the first recursion going at top level. This was one of the most odd results
    // of the reorganisation, since the "old work" seemed much more naturally expressed in terms of values
    // and what happened to them. The "new work" is expressed in terms of paths and how to move amongst them.
    fluid.fetchExpandChildren = function (target, i, segs, source, mergePolicy, miniWorld, options) {
        if (source.expander /* && source.expander.type */) { // possible expander at top level
            var expanded = fluid.expandExpander(target, source, options);
            if (options.freeRoot || fluid.isPrimitive(expanded) || fluid.isDOMish(expanded) || !fluid.isPlainObject(expanded) || (fluid.isArrayable(expanded) ^ fluid.isArrayable(target))) {
                return expanded;
            }
            else { // make an attempt to preserve the root reference if possible
                $.extend(true, target, expanded);
            }
        }
        // NOTE! This expects that RHS is concrete! For material input to "expansion" this happens to be the case, but is not
        // true for other algorithms. Inconsistently, this algorithm uses "sourceStrategy" below. In fact, this "fetchChildren"
        // operation looks like it is a fundamental primitive of the system. We do call "deliverer" early which enables correct
        // reference to parent nodes up the tree - however, anyone processing a tree IN THE CHAIN requires that it is produced
        // concretely at the point STRATEGY returns. Which in fact it is...............
        fluid.each(source, function (newSource, key) {
            if (newSource === undefined) {
                target[key] = undefined; // avoid ever dispatching to ourselves with undefined source
            }
            else if (key !== "expander") {
                segs[i] = key;
                options.strategy(target, key, i + 1, segs, source, mergePolicy, miniWorld);
            }
        });
        return target;
    };

    // TODO: This method is unnecessary and will quadratic inefficiency if RHS block is not concrete.
    // The driver should detect "homogeneous uni-strategy trundling" and agree to preserve the extra
    // "cursor arguments" which should be advertised somehow (at least their number)
    function regenerateCursor (source, segs, limit, sourceStrategy) {
        for (var i = 0; i < limit; ++ i) {
            // copy segs to avoid aliasing with FLUID-5243
            source = sourceStrategy(source, segs[i], i, fluid.makeArray(segs));
        }
        return source;
    }

    // unsupported, NON-API function
    fluid.isUnexpandable = function (source) {
        return fluid.isPrimitive(source) || fluid.isComponent(source) || source.nodeType !== undefined || source.jquery || !fluid.isPlainObject(source);
    };

    // unsupported, NON-API function
    fluid.expandSource = function (options, target, i, segs, deliverer, source, policy, miniWorld, recurse) {
        var expanded, isTrunk, isLate;
        var thisPolicy = fluid.derefMergePolicy(policy);
        if (typeof (source) === "string" && !thisPolicy.noexpand) {
            if (!options.defaultEL || source.charAt(0) === "{") { // hard-code this for performance
                fluid.pushActivity("expandContextValue", "expanding context value %source held at path %path", {source: source, path: fluid.path.apply(null, segs.slice(0, i))});
                expanded = fluid.resolveContextValue(source, options);
                fluid.popActivity(1);
            } else {
                expanded = source;
            }
        }
        else if (thisPolicy.noexpand || fluid.isUnexpandable(source)) {
            expanded = source;
        }
        else if (source.expander) {
            expanded = fluid.expandExpander(deliverer, source, options);
        }
        else {
            if (thisPolicy.preserve) {
                expanded = source;
                isLate = true;
            }
            else {
                expanded = fluid.freshContainer(source);
            }
            isTrunk = true;
        }
        if (!isLate && expanded !== fluid.NO_VALUE) {
            deliverer(expanded);
        }
        if (isTrunk) {
            recurse(expanded, source, i, segs, policy, miniWorld || isLate);
        }
        if (isLate && expanded !== fluid.NO_VALUE) {
            deliverer(expanded);
        }
        return expanded;
    };

    // unsupported, NON-API function
    fluid.makeExpandStrategy = function (options) {
        var recurse = function (target, source, i, segs, policy, miniWorld) {
            return fluid.fetchExpandChildren(target, i || 0, segs || [], source, policy, miniWorld, options);
        };
        var strategy = function (target, name, i, segs, source, policy, miniWorld) {
            if (i > fluid.strategyRecursionBailout) {
                fluid.fail("Overflow/circularity in options expansion, current path is ", segs, " at depth " , i, " - please ensure options are not circularly connected, or protect from expansion using the \"noexpand\" policy or expander");
            }
            if (!target) {
                return;
            }
            if (!miniWorld && target.hasOwnProperty(name)) { // bail out if our work has already been done
                return target[name];
            }
            if (source === undefined) { // recover our state in case this is an external entry point
                source = regenerateCursor(options.source, segs, i - 1, options.sourceStrategy);
                policy = regenerateCursor(options.mergePolicy, segs, i - 1, fluid.concreteTrundler);
            }
            var thisSource = options.sourceStrategy(source, name, i, segs);
            var thisPolicy = fluid.concreteTrundler(policy, name);
            function deliverer(value) {
                target[name] = value;
            }
            return fluid.expandSource(options, target, i, segs, deliverer, thisSource, thisPolicy, miniWorld, recurse);
        };
        options.recurse = recurse;
        options.strategy = strategy;
        return strategy;
    };

    fluid.defaults("fluid.makeExpandOptions", {
        ELstyle:          "${}",
        bareContextRefs:  true,
        target:           fluid.inCreationMarker
    });

    // unsupported, NON-API function
    fluid.makeExpandOptions = function (source, options) {
        options = $.extend({}, fluid.rawDefaults("fluid.makeExpandOptions"), options);
        options.defaultEL = options.ELStyle === "${}" && options.bareContextRefs; // optimisation to help expander
        options.expandSource = function (source) {
            return fluid.expandSource(options, null, 0, [], fluid.identity, source, options.mergePolicy, false);
        };
        if (!fluid.isUnexpandable(source)) {
            options.source = source;
            options.target = fluid.freshContainer(source);
            options.sourceStrategy = options.sourceStrategy || fluid.concreteTrundler;
            fluid.makeExpandStrategy(options);
            options.initter = function () {
                options.target = fluid.fetchExpandChildren(options.target, 0, [], options.source, options.mergePolicy, false, options);
            };
        }
        else { // these init immediately since we must deliver a valid root target
            options.strategy = fluid.concreteTrundler;
            options.initter = fluid.identity;
            if (typeof(source) === "string") {
                options.target = options.expandSource(source);
            }
            else {
                options.target = source;
            }
        }
        return options;
    };

    fluid.expand = function (source, options) {
        var expandOptions = fluid.makeExpandOptions(source, options);
        expandOptions.initter();
        return expandOptions.target;
    };

    fluid.registerNamespace("fluid.expander");

    /** "light" expanders, starting with support functions for the so-called "deferredCall" expanders,
         which make an arbitrary function call (after expanding arguments) and are then replaced in
         the configuration with the call results. These will probably be abolished and replaced with
         equivalent model transformation machinery **/

    fluid.expander.deferredCall = function (deliverer, source, options) {
        var expander = source.expander;
        var args = (!expander.args || fluid.isArrayable(expander.args))? expander.args : fluid.makeArray(expander.args);
        args = options.recurse([], args);
        return fluid.invokeGlobalFunction(expander.func, args);
    };

    fluid.deferredCall = fluid.expander.deferredCall; // put in top namespace for convenience

    // This one is now positioned as the "universal expander" - default if no type supplied
    fluid.deferredInvokeCall = function (deliverer, source, options) {
        var expander = source.expander;
        var args = fluid.makeArray(expander.args);
        args = options.recurse([], args); // TODO: risk of double expansion here. embodyDemands will sometimes expand, sometimes not...
        var funcEntry = expander.func || expander.funcName;
        var func = options.expandSource(funcEntry) || fluid.recordToApplicable(expander, options.contextThat);
        if (!func) {
            fluid.fail("Error in expander record - " + funcEntry + " could not be resolved to a function for component ", options.contextThat);
        }
        return func.apply ? func.apply(null, args) : fluid.invoke(func, args, options.contextThat);
    };

    // The "noexpand" expander which simply unwraps one level of expansion and ceases.
    fluid.expander.noexpand = function (deliverer, source) {
        return source.expander.value ? source.expander.value : source.expander.tree;
    };

    fluid.noexpand = fluid.expander.noexpand; // TODO: check naming and namespacing


})(jQuery, fluid_1_5);
;/*
Copyright 2008-2010 University of Cambridge
Copyright 2008-2009 University of Toronto
Copyright 2010-2011 Lucendo Development Ltd.
Copyright 2010-2014 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid_1_5 = fluid_1_5 || {};

(function ($, fluid) {
    "use strict";

    /** NOTE: The contents of this file are by default NOT PART OF THE PUBLIC FLUID API unless explicitly annotated before the function **/

    /** MODEL ACCESSOR ENGINE **/

    /** Standard strategies for resolving path segments **/

    fluid.model.makeEnvironmentStrategy = function (environment) {
        return function (root, segment, index) {
            return index === 0 && environment[segment] ?
                environment[segment] : undefined;
        };
    };

    fluid.model.defaultCreatorStrategy = function (root, segment) {
        if (root[segment] === undefined) {
            root[segment] = {};
            return root[segment];
        }
    };

    fluid.model.defaultFetchStrategy = function (root, segment) {
        return root[segment];
    };

    fluid.model.funcResolverStrategy = function (root, segment) {
        if (root.resolvePathSegment) {
            return root.resolvePathSegment(segment);
        }
    };

    fluid.model.traverseWithStrategy = function (root, segs, initPos, config, uncess) {
        var strategies = config.strategies;
        var limit = segs.length - uncess;
        for (var i = initPos; i < limit; ++i) {
            if (!root) {
                return root;
            }
            var accepted;
            for (var j = 0; j < strategies.length; ++ j) {
                accepted = strategies[j](root, segs[i], i + 1, segs);
                if (accepted !== undefined) {
                    break; // May now short-circuit with stateless strategies
                }
            }
            if (accepted === fluid.NO_VALUE) {
                accepted = undefined;
            }
            root = accepted;
        }
        return root;
    };

    /** Returns both the value and the path of the value held at the supplied EL path **/
    fluid.model.getValueAndSegments = function (root, EL, config, initSegs) {
        return fluid.model.accessWithStrategy(root, EL, fluid.NO_VALUE, config, initSegs, true);
    };

    // Very lightweight remnant of trundler, only used in resolvers
    fluid.model.makeTrundler = function (config) {
        return function (valueSeg, EL) {
            return fluid.model.getValueAndSegments(valueSeg.root, EL, config, valueSeg.segs);
        };
    };

    fluid.model.getWithStrategy = function (root, EL, config, initSegs) {
        return fluid.model.accessWithStrategy(root, EL, fluid.NO_VALUE, config, initSegs);
    };

    fluid.model.setWithStrategy = function (root, EL, newValue, config, initSegs) {
        fluid.model.accessWithStrategy(root, EL, newValue, config, initSegs);
    };

    fluid.model.accessWithStrategy = function (root, EL, newValue, config, initSegs, returnSegs) {
        // This function is written in this unfortunate style largely for efficiency reasons. In many cases
        // it should be capable of running with 0 allocations (EL is preparsed, initSegs is empty)
        if (!fluid.isPrimitive(EL) && !fluid.isArrayable(EL)) {
            var key = EL.type || "default";
            var resolver = config.resolvers[key];
            if (!resolver) {
                fluid.fail("Unable to find resolver of type " + key);
            }
            var trundler = fluid.model.makeTrundler(config); // very lightweight trundler for resolvers
            var valueSeg = {root: root, segs: initSegs};
            valueSeg = resolver(valueSeg, EL, trundler);
            if (EL.path && valueSeg) { // every resolver supports this piece of output resolution
                valueSeg = trundler(valueSeg, EL.path);
            }
            return returnSegs ? valueSeg : (valueSeg ? valueSeg.root : undefined);
        }
        else {
            return fluid.model.accessImpl(root, EL, newValue, config, initSegs, returnSegs, fluid.model.traverseWithStrategy);
        }
    };

    // Implementation notes: The EL path manipulation utilities here are somewhat more thorough
    // and expensive versions of those provided in Fluid.js - there is some duplication of
    // functionality. This is a tradeoff between stability and performance - the versions in
    // Fluid.js are the most frequently used and do not implement escaping of characters .
    // as \. and \ as \\ as the versions here. The implementations here are not
    // performant and are left here partially as an implementation note. Problems will
    // arise if clients manipulate JSON structures containing "." characters in keys as if they
    // are models. The basic utilities fluid.path(), fluid.parseEL and fluid.composePath are
    // the ones recommended for general users and the following implementations will
    // be upgraded to use regexes in future to make them better alternatives

    fluid.registerNamespace("fluid.pathUtil");

    var getPathSegmentImpl = function (accept, path, i) {
        var segment = null; // TODO: rewrite this with regexes and replaces
        if (accept) {
            segment = "";
        }
        var escaped = false;
        var limit = path.length;
        for (; i < limit; ++i) {
            var c = path.charAt(i);
            if (!escaped) {
                if (c === ".") {
                    break;
                }
                else if (c === "\\") {
                    escaped = true;
                }
                else if (segment !== null) {
                    segment += c;
                }
            }
            else {
                escaped = false;
                if (segment !== null) {
                    segment += c;
                }
            }
        }
        if (segment !== null) {
            accept[0] = segment;
        }
        return i;
    };

    var globalAccept = []; // TODO: serious reentrancy risk here, why is this impl like this?

    /** A version of fluid.model.parseEL that apples escaping rules - this allows path segments
     * to contain period characters . - characters "\" and "}" will also be escaped. WARNING -
     * this current implementation is EXTREMELY slow compared to fluid.model.parseEL and should
     * not be used in performance-sensitive applications */
    // supported, PUBLIC API function
    fluid.pathUtil.parseEL = function (path) {
        var togo = [];
        var index = 0;
        var limit = path.length;
        while (index < limit) {
            var firstdot = getPathSegmentImpl(globalAccept, path, index);
            togo.push(globalAccept[0]);
            index = firstdot + 1;
        }
        return togo;
    };

    // supported, PUBLIC API function
    fluid.pathUtil.composeSegment = function (prefix, toappend) {
        toappend = toappend.toString();
        for (var i = 0; i < toappend.length; ++i) {
            var c = toappend.charAt(i);
            if (c === "." || c === "\\" || c === "}") {
                prefix += "\\";
            }
            prefix += c;
        }
        return prefix;
    };

    /** Escapes a single path segment by replacing any character ".", "\" or "}" with
     * itself prepended by \
     */
     // supported, PUBLIC API function
    fluid.pathUtil.escapeSegment = function (segment) {
        return fluid.pathUtil.composeSegment("", segment);
    };

    /**
     * Compose a prefix and suffix EL path, where the prefix is already escaped.
     * Prefix may be empty, but not null. The suffix will become escaped.
     */
    // supported, PUBLIC API function
    fluid.pathUtil.composePath = function (prefix, suffix) {
        if (prefix.length !== 0) {
            prefix += ".";
        }
        return fluid.pathUtil.composeSegment(prefix, suffix);
    };

    /**
     * Compose a set of path segments supplied as arguments into an escaped EL expression. Escaped version
     * of fluid.model.composeSegments
     */

    // supported, PUBLIC API function
    fluid.pathUtil.composeSegments = function () {
        var path = "";
        for (var i = 0; i < arguments.length; ++ i) {
            path = fluid.pathUtil.composePath(path, arguments[i]);
        }
        return path;
    };

    fluid.model.unescapedParser = {
        parse: fluid.model.parseEL,
        compose: fluid.model.composeSegments
    };

    // supported, PUBLIC API record
    fluid.model.defaultGetConfig = {
        parser: fluid.model.unescapedParser,
        strategies: [fluid.model.funcResolverStrategy, fluid.model.defaultFetchStrategy]
    };

    // supported, PUBLIC API record
    fluid.model.defaultSetConfig = {
        parser: fluid.model.unescapedParser,
        strategies: [fluid.model.funcResolverStrategy, fluid.model.defaultFetchStrategy, fluid.model.defaultCreatorStrategy]
    };

    fluid.model.escapedParser = {
        parse: fluid.pathUtil.parseEL,
        compose: fluid.pathUtil.composeSegments
    };

    // supported, PUBLIC API record
    fluid.model.escapedGetConfig = {
        parser: fluid.model.escapedParser,
        strategies: [fluid.model.defaultFetchStrategy]
    };

    // supported, PUBLIC API record
    fluid.model.escapedSetConfig = {
        parser: fluid.model.escapedParser,
        strategies: [fluid.model.defaultFetchStrategy, fluid.model.defaultCreatorStrategy]
    };

    /** MODEL COMPONENT HIERARCHY AND RELAY SYSTEM **/

    fluid.initSimpleModel = function (that, optionsModel) {
        that.model = optionsModel || {};
        return that.model;
    };

    fluid.initRelayModel = function (that, modelRelayModel) {
        return modelRelayModel;
    };

    // TODO: This utility compensates for our lack of control over "wave of explosions" initialisation - we may
    // catch a model when it is apparently "completely initialised" and that's the best we can do, since we have
    // missed its own initial transaction

    fluid.isModelComplete = function (that) {
        return that.model !== fluid.inEvaluationMarker;
    };

    // Enlist this model component as part of the "initial transaction" wave - note that "special transaction" init
    // is indexed by component, not by applier, and has special record type (complete + initModel), not transaction
    fluid.enlistModelComponent = function (that) {
        var instantiator = fluid.getInstantiator(that);
        var enlist = instantiator.modelTransactions.init[that.id];
        if (!enlist) {
            enlist = {
                that: that,
                complete: fluid.isModelComplete(that)
            };
            instantiator.modelTransactions.init[that.id] = enlist;
        }
        return enlist;
    };

    // Utility to coordinate with our crude "oscillation prevention system" which limits each link to 2 updates (presumably
    // in opposite directions). In the case of the initial transaction, we need to reset the count given that genuine
    // changes are arising in the system with each new enlisted model. TODO: if we ever get users operating their own
    // transactions, think of a way to incorporate this into that workflow
    fluid.clearLinkCounts = function (transRec, relaysAlso) {
        fluid.each(transRec, function (value, key) {
            if (typeof(value) === "number") {
                transRec[key] = 0;
            } else if (relaysAlso && value.options && typeof(value.options.relayCount) === "number") {
                value.options.relayCount = 0;
            }
        });
    };

    fluid.sortCompleteLast = function (reca, recb) {
        return (reca.completeOnInit ? 1 : 0) - (recb.completeOnInit ? 1 : 0);
    };

    // Operate all coordinated transactions by bringing models to their respective initial values, and then commit them all
    fluid.operateInitialTransaction = function (instantiator, mrec) {
        var transId = fluid.allocateGuid();
        var transRec = fluid.getModelTransactionRec(instantiator, transId);
        var transac;
        var transacs = fluid.transform(mrec, function (recel) {
            transac = recel.that.applier.initiate(transId);
            transRec[recel.that.applier.applierId] = {transaction: transac};
            return transac;
        });
        // TODO: This sort has very little effect in any current test (can be replaced by no-op - see FLUID-5339) - but
        // at least can't be performed in reverse order ("FLUID-3674 event coordination test" will fail) - need more cases
        var recs = fluid.values(mrec).sort(fluid.sortCompleteLast);
        fluid.each(recs, function (recel) {
            var that = recel.that;
            var transac = transacs[that.id];
            if (recel.completeOnInit) {
                fluid.initModelEvent(that, transac, that.applier.changeListeners.listeners);
            } else {
                fluid.each(recel.initModels, function (initModel) {
                    transac.fireChangeRequest({type: "ADD", segs: [], value: initModel});
                    fluid.clearLinkCounts(transRec, true);
                });
            }
            var shadow = fluid.shadowForComponent(that);
            shadow.modelComplete = true; // technically this is a little early, but this flag is only read in fluid.connectModelRelay
        });

        transac.commit(); // committing one representative transaction will commit them all
    };

    // This modelComponent has now concluded initialisation - commit its initialisation transaction if it is the last such in the wave
    fluid.deenlistModelComponent = function (that) {
        var instantiator = fluid.getInstantiator(that);
        var mrec = instantiator.modelTransactions.init;
        that.model = undefined; // Abuse of the ginger system - in fact it is "currently in evaluation" - we need to return a proper initial model value even if no init occurred yet
        mrec[that.id].complete = true; // flag means - "complete as in ready to participate in this transaction"
        var incomplete = fluid.find_if(mrec, function (recel) {
            return recel.complete !== true;
        });
        if (!incomplete) {
            fluid.operateInitialTransaction(instantiator, mrec);
            // NB: Don't call fluid.concludeTransaction since "init" is not a standard record - this occurs in commitRelays for the corresponding genuine record as usual
            instantiator.modelTransactions.init = {};
        }
    };

    fluid.transformToAdapter = function (transform, targetPath) {
        var basedTransform = {};
        basedTransform[targetPath] = transform;
        return function (trans, newValue /*, sourceSegs, targetSegs */) {
            // TODO: More efficient model that can only run invalidated portion of transform (need to access changeMap of source transaction)
            fluid.model.transformWithRules(newValue, basedTransform, {finalApplier: trans});
        };
    };

    fluid.parseModelReference = function (that, ref) {
        var parsed = fluid.parseContextReference(ref);
        parsed.segs = that.applier.parseEL(parsed.path);
        return parsed;
    };

    fluid.parseValidModelReference = function (that, name, ref) {
        var reject = function (message) {
            fluid.fail("Error in " + name + ": " + ref + message);
        };
        var parsed, target;
        if (ref.charAt(0) === "{") {
            parsed = fluid.parseModelReference(that, ref);
            if (parsed.segs[0] !== "model") {
                reject(" must be a reference into a component model beginning with \"model\"");
            } else {
                parsed.modelSegs = parsed.segs.slice(1);
                delete parsed.path;
            }
            target = fluid.resolveContext(parsed.context, that);
            if (!target) {
                reject(" must be a reference to an existing component");
            }
        } else {
            target = that;
            parsed = {
                path: ref,
                modelSegs: that.applier.parseEL(ref)
            };
        }
        if (!target.applier) {
            fluid.getForComponent(target, ["applier"]);
        }
        if (!target.applier) {
            reject(" must be a reference to a component with a ChangeApplier (descended from fluid.modelComponent)");
        }
        parsed.that = target;
        parsed.applier = target.applier;
        // TODO: remove this when the old ChangeApplier is abolished
        if (!parsed.path) {
            parsed.path = target.applier.composeSegments.apply(null, parsed.modelSegs);
        }
        return parsed;
    };

    // Gets global record for a particular transaction id - looks up applier id to transaction,
    // as well as looking up source id (linkId in below) to count/true
    fluid.getModelTransactionRec = function (instantiator, transId) {
        if (!transId) {
            fluid.fail("Cannot get transaction record without transaction id");
        }
        var transRec = instantiator.modelTransactions[transId];
        if (!transRec && !instantiator.free) {
            transRec = instantiator.modelTransactions[transId] = {};
            transRec.externalChanges = {}; // index by applierId to changePath to listener record
        }
        return transRec;
    };

    fluid.recordChangeListener = function (component, applier, sourceListener) {
        var shadow = fluid.shadowForComponent(component);
        fluid.recordListener(applier.modelChanged, sourceListener, shadow);
    };

    // Used with various arg combinations from different sources. For standard "implicit relay" or fully lensed relay,
    // the first 4 args will be set, and "options" will be empty

    // For a model-dependent relay, this will be used in two halves - firstly, all of the model
    // sources will bind to the relay transform document itself. In this case the argument "targetApplier" within "options" will be set.
    // In this case, the component known as "target" is really the source - it is a component reference discovered by parsing the
    // relay document.

    // Secondly, the relay itself will schedule an invalidation (as if receiving change to "*" of its source - which may in most
    // cases actually be empty) and play through its transducer. "Source" component itself is never empty, since it is used for listener
    // degistration on destruction (check this is correct for external model relay). However, "sourceSegs" may be empty in the case
    // there is no "source" component registered for the link. This change is played in a "half-transactional" way - that is, we wait
    // for all other changes in the system to settle before playing the relay document, in order to minimise the chances of multiple
    // firing and corruption. This is done via the "preCommit" hook registered at top level in establishModelRelay. This listener
    // is transactional but it does not require the transaction to conclude in order to fire - it may be reused as many times as
    // required within the "overall" transaction whilst genuine (external) changes continue to arrive.

    fluid.registerDirectChangeRelay = function (target, targetSegs, source, sourceSegs, linkId, transducer, options) {
        var instantiator = fluid.getInstantiator(target);
        var targetApplier = options.targetApplier || target.applier; // implies the target is a relay document
        var sourceApplier = options.sourceApplier || source.applier; // implies the source is a relay document - listener will be transactional
        var applierId = targetApplier.applierId;
        targetSegs = fluid.makeArray(targetSegs);
        sourceSegs = sourceSegs ? fluid.makeArray(sourceSegs) : sourceSegs; // take copies since originals will be trashed
        var sourceListener = function (newValue, oldValue, path, changeRequest, trans, applier) {
            var transId = trans.id;
            var transRec = fluid.getModelTransactionRec(instantiator, transId);
            if (applier && trans) {
                transRec[applier.applierId] = {transaction: trans}; // enlist the outer user's original transaction
            }
            var existing = transRec[applierId];
            transRec[linkId] = transRec[linkId] || 0;
            // Crude "oscillation prevention" system limits each link to maximum of 2 operations per cycle (presumably in opposite directions)
            var relay = true; // TODO: See FLUID-5303 - we currently disable this check entirely to solve FLUID-5293 - perhaps we might remove link counts entirely
            if (relay) {
                ++transRec[linkId];
                if (!existing) {
                    var newTrans = targetApplier.initiate(transId, true); // non-top-level transaction will defeat postCommit
                    existing = transRec[applierId] = {transaction: newTrans, options: options};
                }
                if (transducer && !options.targetApplier) {
                    transducer(existing.transaction, options.sourceApplier ? undefined : newValue, sourceSegs, targetSegs);
                } else if (newValue !== undefined) {
                    existing.transaction.fireChangeRequest({type: "ADD", segs: targetSegs, value: newValue});
                }
            }
        };
        if (sourceSegs) {
            sourceApplier.modelChanged.addListener({
                isRelay: true,
                segs: sourceSegs,
                transactional: options.transactional
            }, sourceListener);
        }
        if (source) { // TODO - we actually may require to register on THREE sources in the case modelRelay is attached to a
            // component which is neither source nor target. Note there will be problems if source, say, is destroyed and recreated,
            // and holder is not - relay will in that case be lost. Need to integrate relay expressions with IoCSS.
            fluid.recordChangeListener(source, sourceApplier, sourceListener);
            if (target !== source) {
                fluid.recordChangeListener(target, sourceApplier, sourceListener);
            }
        }
    };

    // When called during parsing a contextualised model relay document, these arguments are reversed - "source" refers to the
    // current component, and "target" refers successively to the various "source" components.
    // "options" will be transformPackage
    fluid.connectModelRelay = function (source, sourceSegs, target, targetSegs, options) {
        var linkId = fluid.allocateGuid();
        function enlistComponent(component) {
            var enlist = fluid.enlistModelComponent(component);

            if (enlist.complete) {
                var shadow = fluid.shadowForComponent(component);
                if (shadow.modelComplete) {
                    enlist.completeOnInit = true;
                }
            }
        }
        enlistComponent(target);
        enlistComponent(source); // role of "source" and "target" may have been swapped in a modelRelay document

        if (options.update) { // it is a call via parseImplicitRelay for a relay document
            if (options.targetApplier) {
                // register changes from the model onto changes to the model relay document
                fluid.registerDirectChangeRelay(source, sourceSegs, target, targetSegs, linkId, null, {
                    targetApplier: options.targetApplier,
                    relayCount: options.relayCount,
                    update: options.update
                });
            } else {
                // if parsing a contextualised MR, skip the "orthogonal" registration - instead
                // register the "half-transactional" listener which binds changes from the relay itself onto the target
                fluid.registerDirectChangeRelay(target, targetSegs, source, [], linkId+"-transform", options.forwardAdapter, {transactional: true, sourceApplier: options.forwardApplier});
            }
        } else { // more efficient branch where relay is uncontextualised
            fluid.registerDirectChangeRelay(target, targetSegs, source, sourceSegs, linkId, options.forwardAdapter, {});
            if (sourceSegs) {
                fluid.registerDirectChangeRelay(source, sourceSegs, target, targetSegs, linkId, options.backwardAdapter, {});
            }
        }
    };
    
    fluid.model.guardedAdapter = function (componentThat, cond, func, args) {
        // TODO: We can't use fluid.isModelComplete here because of the broken half-transactional system - it may appear that model has arrived halfway through init transaction
        var isInit = componentThat.modelRelay === fluid.inEvaluationMarker;
        var condValue = cond[isInit ? "init" : "live"];
        if (condValue) {
            func.apply(null, args);
        }
    };

    fluid.makeTransformPackage = function (componentThat, transform, sourcePath, targetPath, forwardCond, backwardCond) {
        var that = {
            forwardHolder: {model: transform},
            backwardHolder: {model: null}
        };
        that.generateAdapters = function (trans) {
            // can't commit "half-transaction" or events will fire - violate encapsulation in this way
            that.forwardAdapterImpl = fluid.transformToAdapter(trans ? trans.newHolder.model : that.forwardHolder.model, targetPath);
            if (sourcePath !== null) {
                that.backwardHolder.model = fluid.model.transform.invertConfiguration(transform);
                that.backwardAdapterImpl = fluid.transformToAdapter(that.backwardHolder.model, sourcePath);
            }
        };
        that.forwardAdapter = function (transaction, newValue) { // create a stable function reference for this possibly changing adapter
            if (newValue === undefined) {
                that.generateAdapters(); // TODO: Quick fix for incorrect scheduling of invalidation/transducing
                // "it so happens" that fluid.registerDirectChangeRelay invokes us with empty newValue in the case of invalidation -> transduction
            }
            fluid.model.guardedAdapter(componentThat, forwardCond, that.forwardAdapterImpl, arguments);
        };
        // fired from fluid.model.updateRelays via invalidator event
        that.runTransform = function (trans) {
            trans.commit(); // this will reach the special "half-transactional listener" registered in fluid.connectModelRelay,
            // branch with options.targetApplier - by committing the transaction, we update the relay document in bulk and then cause
            // it to execute (via "transducer")
            trans.reset();
        };
        that.forwardApplier = fluid.makeNewChangeApplier(that.forwardHolder);
        that.forwardApplier.isRelayApplier = true; // special annotation so these can be discovered in the transaction record
        that.invalidator = fluid.makeEventFirer(null, null, "Invalidator for model relay with applier " + that.forwardApplier.applierId);
        if (sourcePath !== null) {
            that.backwardApplier = fluid.makeNewChangeApplier(that.backwardHolder);
            that.backwardAdapter = function () {
                fluid.model.guardedAdapter(componentThat, backwardCond, that.backwardAdapterImpl, arguments);
            };
        }
        that.update = that.invalidator.fire; // necessary so that both routes to fluid.connectModelRelay from here hit the first branch
        var implicitOptions = {
            relayCount: 0, // this count is updated in fluid.model.updateRelays
            targetApplier: that.forwardApplier, // this special field identifies us to fluid.connectModelRelay
            update: that.update,
            refCount: 0
        };
        that.forwardHolder.model = fluid.parseImplicitRelay(componentThat, transform, [], implicitOptions);
        that.refCount = implicitOptions.refCount;
        that.generateAdapters();
        that.invalidator.addListener(that.generateAdapters);
        that.invalidator.addListener(that.runTransform);
        return that;
    };

    fluid.singleTransformToFull = function (singleTransform) {
        var withPath = $.extend(true, {valuePath: ""}, singleTransform);
        return {
            "": {
                transform: withPath
            }
        };
    };
    
    fluid.model.relayConditions = {
        initOnly: {init: true,  live: false},
        liveOnly: {init: false, live: true},
        never:    {init: false, live: false},
        always:   {init: true,  live: true}
    };
    
    fluid.model.parseRelayCondition = function (condition) {
        return fluid.model.relayConditions[condition || "always"];
    };

    fluid.parseModelRelay = function (that, mrrec) {
        var parsedSource = mrrec.source ? fluid.parseValidModelReference(that, "modelRelay record member \"source\"", mrrec.source) :
            {path: null, modelSegs: null};
        var parsedTarget = fluid.parseValidModelReference(that, "modelRelay record member \"target\"", mrrec.target);

        var transform = mrrec.singleTransform ? fluid.singleTransformToFull(mrrec.singleTransform) : mrrec.transform;
        if (!transform) {
            fluid.fail("Cannot parse modelRelay record without element \"singleTransform\" or \"transform\":", mrrec);
        }
        var forwardCond = fluid.model.parseRelayCondition(mrrec.forward), backwardCond = fluid.model.parseRelayCondition(mrrec.backward);
        var transformPackage = fluid.makeTransformPackage(that, transform, parsedSource.path, parsedTarget.path, forwardCond, backwardCond);
        if (transformPackage.refCount === 0) {
            // This first call binds changes emitted from the relay ends to each other, synchronously
            fluid.connectModelRelay(parsedSource.that || that, parsedSource.modelSegs, parsedTarget.that, parsedTarget.modelSegs, {
                forwardAdapter: transformPackage.forwardAdapter,
                backwardAdapter: transformPackage.backwardAdapter
            });
        } else {
            // This second call binds changes emitted from the relay document itself onto the relay ends (using the "half-transactional system")
            fluid.connectModelRelay(parsedSource.that || that, parsedSource.modelSegs, parsedTarget.that, parsedTarget.modelSegs, transformPackage);
        }
    };

    fluid.parseImplicitRelay = function (that, modelRec, segs, options) {
        var value;
        if (typeof(modelRec) === "string" && modelRec.charAt(0) === "{") {
            var parsed = fluid.parseModelReference(that, modelRec);
            var target = fluid.resolveContext(parsed.context, that);
            if (parsed.segs[0] === "model") {
                var modelSegs = parsed.segs.slice(1);
                ++options.refCount;
                fluid.connectModelRelay(that, segs, target, modelSegs, options);
            } else {
                value = fluid.getForComponent(target, parsed.segs);
            }
        } else if (fluid.isPrimitive(modelRec) || !fluid.isPlainObject(modelRec)) {
            value = modelRec;
        } else if (modelRec.expander && fluid.isPlainObject(modelRec.expander)) {
            value = fluid.expandOptions(modelRec, that);
        } else {
            value = fluid.freshContainer(modelRec);
            fluid.each(modelRec, function (innerValue, key) {
                segs.push(key);
                var innerTrans = fluid.parseImplicitRelay(that, innerValue, segs, options);
                if (innerTrans !== undefined) {
                    value[key] = innerTrans;
                }
                segs.pop();
            });
        }
        return value;
    };
    
        
    // Conclude the transaction by firing to all external listeners in priority order
    fluid.model.notifyExternal = function (transRec) {
        var allChanges = transRec ? fluid.values(transRec.externalChanges) : [];
        allChanges.sort(fluid.priorityComparator);
        for (var i = 0; i < allChanges.length; ++ i) {
            var change = allChanges[i];
            change.listener.apply(null, change.args);
        }
    };
    
    fluid.model.commitRelays = function (instantiator, transactionId) {
        var transRec = instantiator.modelTransactions[transactionId];
        fluid.each(transRec, function (transEl) {
        // EXPLAIN: This must commit ALL current transactions, not just those for relays - why?
            if (transEl.transaction) { // some entries are links
                transEl.transaction.commit("relay");
                transEl.transaction.reset();
            }
        });
        fluid.clearLinkCounts(transRec, true); // "options" structures for relayCount are aliased
    };

    fluid.model.updateRelays = function (instantiator, transactionId) {
        var transRec = instantiator.modelTransactions[transactionId];
        var updates = 0;
        fluid.each(transRec, function (transEl) {
            // TODO: integrate the "source" if any into this computation, and fire the relay if it has changed - perhaps by adding a listener
            // to it that updates changeRecord.changes (assuming we can find it)
            if (transEl.options && transEl.transaction && transEl.transaction.changeRecord.changes > 0 && transEl.options.relayCount < 2 && transEl.options.update) {
                transEl.options.relayCount++;
                fluid.clearLinkCounts(transRec);
                transEl.options.update(transEl.transaction, transRec);
                ++updates;
            }
        });
        return updates;
    };

    fluid.establishModelRelay = function (that, optionsModel, optionsML, optionsMR, applier) {
        fluid.mergeModelListeners(that, optionsML);

        var enlist = fluid.enlistModelComponent(that);
        fluid.each(optionsMR, function (mrrec) {
            fluid.parseModelRelay(that, mrrec);
        });

        var initModels = fluid.transform(optionsModel, function (modelRec) {
            return fluid.parseImplicitRelay(that, modelRec, [], {refCount: 0});
        });
        enlist.initModels = initModels;

        var instantiator = fluid.getInstantiator(that);

        function updateRelays(transaction) {
            while (fluid.model.updateRelays(instantiator, transaction.id) > 0){}
        }

        function commitRelays(transaction, applier, code) {
            if (code !== "relay") { // don't commit relays if this commit is already a relay commit
                fluid.model.commitRelays(instantiator, transaction.id);
            }
        }
        
        function concludeTransaction(transaction, applier, code) {
            if (code !== "relay") {
                fluid.model.notifyExternal(instantiator.modelTransactions[transaction.id]);
                delete instantiator.modelTransactions[transaction.id];
            }
        }
        
        applier.preCommit.addListener(updateRelays);
        applier.preCommit.addListener(commitRelays);
        applier.postCommit.addListener(concludeTransaction);

        fluid.deenlistModelComponent(that);

        return applier.holder.model;
    };

    // Grade common to "old" and "new" model components
    fluid.defaults("fluid.commonModelComponent", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        mergePolicy: {
            modelListeners: fluid.makeMergeListenersPolicy(fluid.arrayConcatPolicy)
        }
    });

    // supported, PUBLIC API grade
    fluid.defaults("fluid.modelComponent", {
        gradeNames: ["fluid.commonModelComponent", "autoInit"],
        members: {
            model: "@expand:fluid.initSimpleModel({that}, {that}.options.model)",
            applier: "@expand:fluid.makeChangeApplier({that}.model, {that}.options.changeApplierOptions)",
            modelListeners: "@expand:fluid.mergeModelListeners({that}, {that}.options.modelListeners)"
        },
        mergePolicy: {
            model: "preserve"
        }
    });

    // supported, PUBLIC API grade
    fluid.defaults("fluid.modelRelayComponent", {
        gradeNames: ["fluid.commonModelComponent", "fluid.eventedComponent", "autoInit"],
        changeApplierOptions: {
            relayStyle: true,
            cullUnchanged: true
        },
        members: {
            model: "@expand:fluid.initRelayModel({that}, {that}.modelRelay)",
            applier: "@expand:fluid.makeNewChangeApplier({that}, {that}.options.changeApplierOptions)",
            modelRelay: "@expand:fluid.establishModelRelay({that}, {that}.options.model, {that}.options.modelListeners, {that}.options.modelRelay, {that}.applier)"
        },
        mergePolicy: {
            model: {
                noexpand: true,
                func: fluid.arrayConcatPolicy
            },
            modelRelay: {
                noexpand: true,
                func: fluid.arrayConcatPolicy
            }
        }
    });

    // supported, PUBLIC API record
    fluid.defaults("fluid.standardComponent", {
        gradeNames: ["fluid.modelComponent", "fluid.eventedComponent", "autoInit"]
    });

    // supported, PUBLIC API record
    fluid.defaults("fluid.standardRelayComponent", {
        gradeNames: ["fluid.modelRelayComponent", "autoInit"]
    });

    fluid.modelChangedToChange = function (isNewApplier, args) {
        var newModel = args[0], oldModel = args[1], path = args[3]; // in 4th position for old applier
        return isNewApplier ? {
            value: args[0],
            oldValue: args[1],
            path: args[2]
        } : {
            value: fluid.get(newModel, path),
            oldValue: fluid.get(oldModel, path),
            path: path
        };
    };

    fluid.resolveModelListener = function (that, record, isNewApplier) {
        var togo = function () {
            var change = fluid.modelChangedToChange(isNewApplier, arguments);
            var args = [change];
            var localRecord = {change: change, "arguments": args};
            if (record.args) {
                args = fluid.expandOptions(record.args, that, {}, localRecord);
            }
            fluid.event.invokeListener(record.listener, fluid.makeArray(args));
        };
        fluid.event.impersonateListener(record.listener, togo);
        return togo;
    };

    fluid.mergeModelListeners = function (that, listeners) {
        var listenerCount = 0;
        fluid.each(listeners, function (value, path) {
            if (typeof(value) === "string") {
                value = {
                    funcName: value
                };
            }
            var records = fluid.event.resolveListenerRecord(value, that, "modelListeners", null, false);
            var parsed = fluid.parseValidModelReference(that, "modelListeners entry", path);
            var isNewApplier = parsed.applier.preCommit;
            // Bypass fluid.event.dispatchListener by means of "standard = false" and enter our custom workflow including expanding "change":
            fluid.each(records.records, function (record) {
                var func = fluid.resolveModelListener(that, record, isNewApplier);
                var spec = {
                    listener: func, // for initModelEvent
                    listenerIndex: listenerCount,
                    segs: parsed.modelSegs,
                    path: parsed.path,
                    priority: fluid.event.mapPriority(record.priority, listenerCount),
                    transactional: true
                };
                ++listenerCount;
                fluid.addSourceGuardedListener(parsed.applier, spec, record.guardSource, func, "modelChanged", record.namespace, record.softNamespace);
                fluid.recordChangeListener(that, parsed.applier, func);
                function initModelEvent() {
                    if (isNewApplier && fluid.isModelComplete(parsed.that)) {
                        var trans = parsed.applier.initiate();
                        fluid.initModelEvent(that, trans, [spec]);
                        trans.commit();
                    }
                }
                if (that !== parsed.that && !fluid.isModelComplete(that)) { // TODO: Use FLUID-4883 "latched events" when available
                    // Don't confuse the end user by firing their listener before the component is constructed
                    // TODO: Better detection than this is requred - we assume that the target component will not be discovered as part
                    // of the initial transaction wave, but if it is, it will get a double notification - we really need "wave of explosions"
                    // since we are currently too early in initialisation of THIS component in order to tell if other will be found
                    // independently.
                    that.events.onCreate.addListener(initModelEvent);
                }
            });
        });
    };


    /** CHANGE APPLIER **/

    /** COMMON UTILITIES common between old and new ChangeAppliers **/

    /** Add a listener to a ChangeApplier event that only acts in the case the event
     * has not come from the specified source (typically ourself)
     * @param modelEvent An model event held by a changeApplier (typically applier.modelChanged)
     * @param path The path specification to listen to
     * @param source The source value to exclude (direct equality used)
     * @param func The listener to be notified of a change
     * @param [eventName] - optional - the event name to be listened to - defaults to "modelChanged"
     * @param [namespace] - optional - the event namespace
     */
    fluid.addSourceGuardedListener = function(applier, path, source, func, eventName, namespace, softNamespace) {
        eventName = eventName || "modelChanged";
        var wrapped = function (newValue, oldValue, path, changes) { // TODO: adapt signature
            if (!applier.hasChangeSource(source, changes)) {
                return func.apply(null, arguments);
            }
        };
        fluid.event.impersonateListener(func, wrapped);
        applier[eventName].addListener(path, wrapped, namespace, softNamespace);
    };

    /** Convenience method to fire a change event to a specified applier, including
     * a supplied "source" identified (perhaps for use with addSourceGuardedListener)
     */
    fluid.fireSourcedChange = function (applier, path, value, source) {
        applier.fireChangeRequest({
            path: path,
            value: value,
            source: source
        });
    };

    /** Dispatches a list of changes to the supplied applier */
    fluid.requestChanges = function (applier, changes) {
        for (var i = 0; i < changes.length; ++i) {
            applier.fireChangeRequest(changes[i]);
        }
    };


    // Automatically adapts requestChange onto fireChangeRequest
    fluid.bindRequestChange = function (that) {
        // The name "requestChange" will be deprecated in 1.5, removed in 2.0
        that.requestChange = that.change = function (path, value, type) {
            var changeRequest = {
                path: path,
                value: value,
                type: type
            };
            that.fireChangeRequest(changeRequest);
        };
    };

    fluid.identifyChangeListener = function (listener) {
        return fluid.event.identifyListener(listener) || listener;
    };


    /** NEW CHANGEAPPLIER IMPLEMENTATION (Will be default in Infusion 2.0 onwards **/

    fluid.typeCode = function (totest) {
        return fluid.isPrimitive(totest) || !fluid.isPlainObject(totest) ? "primitive" :
            fluid.isArrayable(totest) ? "array" : "object";
    };

    fluid.model.isChangedPath = function (changeMap, segs) {
        for (var i = 0; i <= segs.length; ++ i) {
            if (typeof(changeMap) === "string") {
                return true;
            }
            if (i < segs.length && changeMap) {
                changeMap = changeMap[segs[i]];
            }
        }
        return false;
    };

    fluid.model.setChangedPath = function (options, segs, value) {
        var notePath = function (record) {
            segs.unshift(record);
            fluid.model.setSimple(options, segs, value);
            segs.shift();
        };
        if (!fluid.model.isChangedPath(options.changeMap, segs)) {
            ++options.changes;
            notePath("changeMap");
        }
        if (!fluid.model.isChangedPath(options.deltaMap, segs)) {
            ++options.deltas;
            notePath("deltaMap");
        }
    };

    fluid.model.fetchChangeChildren = function (target, i, segs, source, options) {
        fluid.each(source, function (value, key) {
            segs[i] = key;
            fluid.model.applyChangeStrategy(target, key, i, segs, value, options);
            segs.length = i;
        });
    };

    // Called with two primitives which are compared for equality. This takes account of "floating point slop" to avoid
    // continuing to propagate inverted values as changes
    // TODO: replace with a pluggable implementation
    fluid.model.isSameValue = function (a, b) {
        if (typeof(a) !== "number" || typeof(b) !== "number") {
            return a === b;
        } else {
            if (a === b) {
                return true;
            } else {
                var relError = Math.abs((a - b) / b);
                return relError < 1e-12; // 64-bit floats have approx 16 digits accuracy, this should deal with most reasonable transforms
            }
        }
    };

    fluid.model.applyChangeStrategy = function (target, name, i, segs, source, options) {
        var targetSlot = target[name];
        var sourceCode = fluid.typeCode(source);
        var targetCode = fluid.typeCode(targetSlot);
        var changedValue = fluid.NO_VALUE;
        if (sourceCode === "primitive") {
            if (!fluid.model.isSameValue(targetSlot, source)) {
                changedValue = source;
            }
        } else if (targetCode !== sourceCode || sourceCode === "array" && source.length !== targetSlot.length) {
            // RH is not primitive - array or object and mismatching or any array rewrite
            changedValue = fluid.freshContainer(source);
        }
        if (changedValue !== fluid.NO_VALUE) {
            target[name] = changedValue;
            if (options.changeMap) {
                fluid.model.setChangedPath(options, segs, "ADD");
            }
        }
        if (sourceCode !== "primitive") {
            fluid.model.fetchChangeChildren(target[name], i + 1, segs, source, options);
        }
    };

    fluid.model.stepTargetAccess = function (target, type, segs, startpos, endpos, options) {
        for (var i = startpos; i < endpos; ++ i) {
            var oldTrunk = target[segs[i]];
            target = fluid.model.traverseWithStrategy(target, segs, i, options[type === "ADD" ? "resolverSetConfig" : "resolverGetConfig"],
                segs.length - i - 1);
            if (oldTrunk !== target && options.changeMap) {
                fluid.model.setChangedPath(options, segs.slice(0, i + 1), "ADD");
            }
        }
        return {root: target, last: segs[endpos]};
    };

    fluid.model.defaultAccessorConfig = function (options) {
        options = options || {};
        options.resolverSetConfig = options.resolverSetConfig || fluid.model.defaultSetConfig;
        options.resolverGetConfig = options.resolverGetConfig || fluid.model.defaultGetConfig;
        return options;
    };

    // After the 1.5 release, this will replace the old "applyChangeRequest"
    // Changes: "MERGE" action abolished
    // ADD/DELETE at root can be destructive
    // changes tracked in optional final argument holding "changeMap: {}, changes: 0"
    fluid.model.applyHolderChangeRequest = function (holder, request, options) {
        options = fluid.model.defaultAccessorConfig(options);
        options.deltaMap = options.changeMap ? {} : null;
        options.deltas = 0;
        var length = request.segs.length;
        var pen, atRoot = length === 0;
        if (atRoot) {
            pen = {root: holder, last: "model"};
        } else {
            if (!holder.model) {
                holder.model = {};
                fluid.model.setChangedPath(options, [], "ADD");
            }
            pen = fluid.model.stepTargetAccess(holder.model, request.type, request.segs, 0, length - 1, options);
        }
        if (request.type === "ADD") {
            var value = request.value;
            var segs = fluid.makeArray(request.segs);
            fluid.model.applyChangeStrategy(pen.root, pen.last, length - 1, segs, value, options, atRoot);
        } else if (request.type === "DELETE") {
            if (pen.root && pen.root[pen.last] !== undefined) {
                delete pen.root[pen.last];
                if (options.changeMap) {
                    fluid.model.setChangedPath(options, request.segs, "DELETE");
                }
            }
        } else {
            fluid.fail("Unrecognised change type of " + request.type);
        }
        return options.deltas ? options.deltaMap : null;
    };

    // Here we only support for now very simple expressions which have at most one
    // wildcard which must appear in the final segment
    fluid.matchChanges = function (changeMap, specSegs, newHolder) {
        var root = newHolder.model;
        var map = changeMap;
        var outSegs = ["model"];
        var wildcard = false;
        var togo = [];
        for (var i = 0; i < specSegs.length; ++ i) {
            var seg = specSegs[i];
            if (seg === "*") {
                if (i === specSegs.length - 1) {
                    wildcard = true;
                } else {
                    fluid.fail("Wildcard specification in modelChanged listener is only supported for the final path segment: " + specSegs.join("."));
                }
            } else {
                outSegs.push(seg);
                map = fluid.isPrimitive(map) ? map : map[seg];
                root = root ? root[seg] : undefined;
            }
        }
        if (map) {
            if (wildcard) {
                fluid.each(root, function (value, key) {
                    togo.push(outSegs.concat(key));
                });
            } else {
                togo.push(outSegs);
            }
        }
        return togo;
    };
    
    fluid.storeExternalChange = function (transRec, applier, invalidPath, spec, args) {
        var pathString = applier.composeSegments.apply(null, invalidPath);
        var keySegs = [applier.applierId, fluid.event.identifyListener(spec.listener), spec.listenerIndex, pathString];
        var keyString = keySegs.join("|");
        // These are unbottled in fluid.concludeTransaction
        transRec.externalChanges[keyString] = {listener: spec.listener, priority: spec.priority, args: args};
    };

    fluid.notifyModelChanges = function (listeners, changeMap, newHolder, oldHolder, changeRequest, transaction, applier, that) {
        var instantiator = fluid.getInstantiator(that);
        var transRec = transaction && fluid.getModelTransactionRec(instantiator, transaction.id);
        for (var i = 0; i < listeners.length; ++ i) {
            var spec = listeners[i];
            var invalidPaths = fluid.matchChanges(changeMap, spec.segs, newHolder);
            for (var j = 0; j < invalidPaths.length; ++ j) {
                var invalidPath = invalidPaths[j];
                spec.listener = fluid.event.resolveListener(spec.listener);
                // TODO: process namespace and softNamespace rules, and propagate "sources" in 4th argument
                var args = [fluid.model.getSimple(newHolder, invalidPath), fluid.model.getSimple(oldHolder, invalidPath), invalidPath.slice(1), changeRequest, transaction, applier];
                if (transRec && !spec.isRelay && spec.transactional) { // bottle up genuine external changes so we can sort and dedupe them later
                    fluid.storeExternalChange(transRec, applier, invalidPath, spec, args);
                } else {
                    spec.listener.apply(null, args);
                }
            }
        }
    };

    fluid.bindELMethods = function (applier) {
        applier.parseEL = function (EL) {
            return fluid.model.pathToSegments(EL, applier.options.resolverSetConfig);
        };
        applier.composeSegments = function () {
            return applier.options.resolverSetConfig.parser.compose.apply(null, arguments);
        };
    };

    fluid.initModelEvent = function (that, trans, listeners) {
        fluid.notifyModelChanges(listeners, "ADD", trans.oldHolder, fluid.emptyHolder, null, trans, that);
    };

    fluid.emptyHolder = { model: undefined };

    fluid.makeNewChangeApplier = function (holder, options) {
        options = fluid.model.defaultAccessorConfig(options);
        var applierId = fluid.allocateGuid();
        var that = {
            applierId: applierId,
            holder: holder,
            changeListeners: {
                listeners: [],
                transListeners: []
            },
            options: options,
            modelChanged: {},
            preCommit: fluid.makeEventFirer(null, null, "preCommit event for ChangeApplier " + applierId),
            postCommit: fluid.makeEventFirer(null, null, "postCommit event for ChangeApplier " + applierId)
        };
        function preFireChangeRequest(changeRequest) {
            if (!changeRequest.type) {
                changeRequest.type = "ADD";
            }
            changeRequest.segs = changeRequest.segs || that.parseEL(changeRequest.path);
        }
        that.modelChanged.addListener = function (spec, listener, namespace, softNamespace) {
            if (typeof(spec) === "string") {
                spec = {path: spec};
            } else {
                spec = fluid.copy(spec);
            }
            spec.id = fluid.event.identifyListener(listener);
            spec.namespace = namespace;
            spec.softNamespace = softNamespace;
            if (typeof(listener) === "string") { // TODO: replicate this nonsense from Fluid.js until we remember its purpose
                listener = {globalName: listener};
            }
            spec.listener = listener;
            var transactional = spec.transactional;
            spec.segs = spec.segs || that.parseEL(spec.path);
            var collection = transactional ? "transListeners" : "listeners";
            that.changeListeners[collection].push(spec);
        };
        that.modelChanged.removeListener = function (listener) {
            var id = fluid.event.identifyListener(listener);
            var namespace = typeof(listener) === "string" ? listener: null;
            var removePred = function (record) {
                return record.id === id || record.namespace === namespace;
            };
            fluid.remove_if(that.changeListeners.listeners, removePred);
            fluid.remove_if(that.changeListeners.transListeners, removePred);
        };
        that.modelChanged.isRelayEvent = true; // TODO: cheap helper for IoC testing framework - remove when old ChangeApplier goes
        that.fireChangeRequest = function (changeRequest) {
            var ation = that.initiate();
            ation.fireChangeRequest(changeRequest);
            ation.commit();
        };

        that.initiate = function (transactionId, defeatPost) { // defeatPost is supplied for all non-top-level transactions
            var trans = {
                instanceId: fluid.allocateGuid(), // for debugging only
                id: transactionId || fluid.allocateGuid(),
                changeRecord: {
                    resolverSetConfig: options.resolverSetConfig, // here to act as "options" in applyHolderChangeRequest
                    resolverGetConfig: options.resolverGetConfig
                },
                reset: function () {
                    trans.oldHolder = holder;
                    trans.newHolder = { model: fluid.copy(holder.model) };
                    trans.changeRecord.changes = 0;
                    trans.changeRecord.changeMap = {};
                },
                commit: function (code) {
                    that.preCommit.fire(trans, that, code);
                    if (trans.changeRecord.changes > 0) {
                        var oldHolder = {model: holder.model};
                        holder.model = trans.newHolder.model;
                        fluid.notifyModelChanges(that.changeListeners.transListeners, trans.changeRecord.changeMap, holder, oldHolder, null, trans, that, holder);
                    }
                    if (!defeatPost) {
                        that.postCommit.fire(trans, that, code);
                    }
                },
                fireChangeRequest: function (changeRequest) {
                    preFireChangeRequest(changeRequest);
                    changeRequest.transactionId = trans.id;
                    var deltaMap = fluid.model.applyHolderChangeRequest(trans.newHolder, changeRequest, trans.changeRecord);
                    fluid.notifyModelChanges(that.changeListeners.listeners, deltaMap, trans.newHolder, holder, changeRequest, trans, that, holder);
                }
            };
            trans.reset();
            fluid.bindRequestChange(trans);
            return trans;
        };
        that.hasChangeSource = function (source, changes) { // compatibility for old API
            return changes ? changes[source] : false;
        };

        fluid.bindRequestChange(that);
        fluid.bindELMethods(that);
        return that;
    };


    /** OLD CHANGEAPPLIER IMPLEMENTATION (Infusion 1.5 and before - this will be removed on Fluid 2.0) **/

    /** Parses a path segment, following escaping rules, starting from character index i in the supplied path */
    fluid.pathUtil.getPathSegment = function (path, i) {
        getPathSegmentImpl(globalAccept, path, i);
        return globalAccept[0];
    };

    /** Returns just the head segment of an EL path */
    fluid.pathUtil.getHeadPath = function (path) {
        return fluid.pathUtil.getPathSegment(path, 0);
    };

    /** Returns all of an EL path minus its first segment - if the path consists of just one segment, returns "" */
    fluid.pathUtil.getFromHeadPath = function (path) {
        var firstdot = getPathSegmentImpl(null, path, 0);
        return firstdot === path.length ? "" : path.substring(firstdot + 1);
    };

    function lastDotIndex(path) {
        // TODO: proper escaping rules
        return path.lastIndexOf(".");
    }

    /** Returns all of an EL path minus its final segment - if the path consists of just one segment, returns "" -
     * WARNING - this method does not follow escaping rules */
    fluid.pathUtil.getToTailPath = function (path) {
        var lastdot = lastDotIndex(path);
        return lastdot === -1 ? "" : path.substring(0, lastdot);
    };

    /** Returns the very last path component of an EL path
     * WARNING - this method does not follow escaping rules */
    fluid.pathUtil.getTailPath = function (path) {
        var lastdot = lastDotIndex(path);
        return fluid.pathUtil.getPathSegment(path, lastdot + 1);
    };

    /** Helpful utility for use in resolvers - matches a path which has already been
      * parsed into segments **/

    fluid.pathUtil.matchSegments = function (toMatch, segs, start, end) {
        if (end - start !== toMatch.length) {
            return false;
        }
        for (var i = start; i < end; ++ i) {
            if (segs[i] !== toMatch[i - start]) {
                return false;
            }
        }
        return true;
    };

    /** Determine the path by which a given path is nested within another **/
    // TODO: This utility is not used in the framework, and will cease to be useful in client code
    // once we move over to the declarative system for change binding
    fluid.pathUtil.getExcessPath = function (base, longer) {
        var index = longer.indexOf(base);
        if (index !== 0) {
            fluid.fail("Path " + base + " is not a prefix of path " + longer);
        }
        if (base.length === longer.length) {
            return "";
        }
        if (longer[base.length] !== ".") {
            fluid.fail("Path " + base + " is not properly nested in path " + longer);
        }
        return longer.substring(base.length + 1);
    };

    /** Determines whether a particular EL path matches a given path specification.
     * The specification consists of a path with optional wildcard segments represented by "*".
     * @param spec (string) The specification to be matched
     * @param path (string) The path to be tested
     * @param exact (boolean) Whether the path must exactly match the length of the specification in
     * terms of path segments in order to count as match. If exact is falsy, short specifications will
     * match all longer paths as if they were padded out with "*" segments
     * @return (array of string) The path segments which matched the specification, or <code>null</code> if there was no match
     */

    fluid.pathUtil.matchPath = function (spec, path, exact) {
        var togo = [];
        while (true) {
            if (((path === "") ^ (spec === "")) && exact) {
                return null;
            }
            // FLUID-4625 - symmetry on spec and path is actually undesirable, but this
            // quickly avoids at least missed notifications - improved (but slower)
            // implementation should explode composite changes
            if (!spec || !path) {
                break;
            }
            var spechead = fluid.pathUtil.getHeadPath(spec);
            var pathhead = fluid.pathUtil.getHeadPath(path);
            // if we fail to match on a specific component, fail.
            if (spechead !== "*" && spechead !== pathhead) {
                return null;
            }
            togo.push(pathhead);
            spec = fluid.pathUtil.getFromHeadPath(spec);
            path = fluid.pathUtil.getFromHeadPath(path);
        }
        return togo;
    };

    fluid.model.isNullChange = function (model, request, resolverGetConfig) {
        if (request.type === "ADD" && !request.forceChange) {
            var existing = fluid.get(model, request.segs, resolverGetConfig);
            if (existing === request.value) {
                return true;
            }
        }
    };

    /** Applies the supplied ChangeRequest object directly to the supplied model.
     */

    fluid.model.applyChangeRequest = function (model, request, resolverSetConfig) {
        var pen = fluid.model.accessWithStrategy(model, request.path, fluid.VALUE, resolverSetConfig || fluid.model.defaultSetConfig, null, true);
        var last = pen.segs[pen.segs.length - 1];

        if (request.type === "ADD" || request.type === "MERGE") {
            if (pen.segs.length === 0 || (request.type === "MERGE" && pen.root[last])) {
                if (request.type === "ADD") {
                    fluid.clear(pen.root);
                }
                $.extend(true, pen.segs.length === 0 ? pen.root : pen.root[last], request.value);
            }
            else {
                pen.root[last] = request.value;
            }
        }
        else if (request.type === "DELETE") {
            if (pen.segs.length === 0) {
                fluid.clear(pen.root);
            }
            else {
                delete pen.root[last];
            }
        }
    };

    // Utility used for source tracking in changeApplier

    function sourceWrapModelChanged(modelChanged, threadLocal) {
        return function (changeRequest) {
            var sources = threadLocal().sources;
            var args = arguments;
            var source = changeRequest.source || "";
            fluid.tryCatch(function () {
                if (sources[source] === undefined) {
                    sources[source] = 0;
                }
                ++sources[source];
                modelChanged.apply(null, args);
            }, null, function() {
                --sources[source];
            });
        };
    }


    /** The core creator function constructing ChangeAppliers. See API documentation
     * at http://wiki.fluidproject.org/display/fluid/ChangeApplier+API for the various
     * options supported in the options structure */

    fluid.makeChangeApplier = function (model, options) {
        return fluid.makeHolderChangeApplier({model: model}, options);
    };

    /** Make a "new-style" ChangeApplier that allows the base model reference to be overwritten. This is
     *  re-read on every access from the object "holder" (in typical usage, the component owning the
     *  ChangeApplier). This implementation will be removed after the 1.5 release */

    fluid.makeHolderChangeApplier = function (holder, options) {
        options = fluid.model.defaultAccessorConfig(options);
        var baseEvents = {
            guards: fluid.event.getEventFirer(false, true, "guard event"),
            postGuards: fluid.event.getEventFirer(false, true, "postGuard event"),
            modelChanged: fluid.event.getEventFirer(false, false, "modelChanged event")
        };
        var threadLocal = fluid.threadLocal(function() { return {sources: {}};});
        var that = {
        // For now, we don't use "id" to avoid confusing component detection which uses
        // a simple algorithm looking for that field
            applierId: fluid.allocateGuid(),
            holder: holder,
            options: options
        };

        function makeGuardWrapper(cullUnchanged) {
            if (!cullUnchanged) {
                return null;
            }
            var togo = function (guard) {
                return function (model, changeRequest, internalApplier) {
                    var oldRet = guard(model, changeRequest, internalApplier);
                    if (oldRet === false) {
                        return false;
                    }
                    else {
                        if (fluid.model.isNullChange(model, changeRequest)) {
                            togo.culled = true;
                            return false;
                        }
                    }
                };
            };
            return togo;
        }

        function wrapListener(listener, spec) {
            var pathSpec = spec;
            var transactional = false;
            var priority = Number.MAX_VALUE;
            if (typeof (spec) === "string") {
                spec = {path: spec};
            }
            pathSpec = spec.path;
            transactional = spec.transactional;
            if (spec.priority !== undefined) {
                priority = spec.priority;
            }
            if (pathSpec.charAt(0) === "!") {
                transactional = true;
                pathSpec = pathSpec.substring(1);
            }
            var wrapped = function (changePath, fireSpec, accum) {
                var guid = fluid.event.identifyListener(listener);
                var exist = fireSpec.guids[guid];
                if (!exist || !accum) {
                    var match = fluid.pathUtil.matchPath(pathSpec, changePath);
                    if (match !== null) {
                        var record = {
                            match: match,
                            pathSpec: pathSpec,
                            listener: listener,
                            priority: priority,
                            transactional: transactional
                        };
                        if (accum) {
                            record.accumulate = [accum];
                        }
                        fireSpec.guids[guid] = record;
                        var collection = transactional ? "transListeners" : "listeners";
                        fireSpec[collection].push(record);
                        fireSpec.all.push(record);
                    }
                }
                else if (accum) {
                    if (!exist.accumulate) {
                        exist.accumulate = [];
                    }
                    exist.accumulate.push(accum);
                }
            };
            fluid.event.impersonateListener(listener, wrapped);
            return wrapped;
        }

        function fireFromSpec(name, fireSpec, args, category, wrapper) {
            return baseEvents[name].fireToListeners(fireSpec[category], args, wrapper);
        }

        function fireComparator(recA, recB) {
            return recA.priority - recB.priority;
        }

        function prepareFireEvent(name, changePath, fireSpec, accum) {
            baseEvents[name].fire(changePath, fireSpec, accum);
            fireSpec.all.sort(fireComparator);
            fireSpec.listeners.sort(fireComparator);
            fireSpec.transListeners.sort(fireComparator);
        }

        function makeFireSpec() {
            return {guids: {}, all: [], listeners: [], transListeners: []};
        }

        function getFireSpec(name, changePath) {
            var fireSpec = makeFireSpec();
            prepareFireEvent(name, changePath, fireSpec);
            return fireSpec;
        }

        function fireEvent(name, changePath, args, wrapper) {
            var fireSpec = getFireSpec(name, changePath);
            return fireFromSpec(name, fireSpec, args, "all", wrapper);
        }

        function adaptListener(that, name) {
            that[name] = {
                addListener: function (spec, listener, namespace, softNamespace) {
                    baseEvents[name].addListener(wrapListener(listener, spec), namespace, null, null, softNamespace);
                },
                removeListener: function (listener) {
                    baseEvents[name].removeListener(listener);
                }
            };
        }
        adaptListener(that, "guards");
        adaptListener(that, "postGuards");
        adaptListener(that, "modelChanged");

        function preFireChangeRequest(changeRequest) {
            if (!changeRequest.type) {
                changeRequest.type = "ADD";
            }
            changeRequest.segs = that.parseEL(changeRequest.path);
        }

        var bareApplier = {
            fireChangeRequest: function (changeRequest) {
                that.fireChangeRequest(changeRequest, true);
            }
        };
        fluid.bindRequestChange(bareApplier);

        that.fireChangeRequest = function (changeRequest) {
            preFireChangeRequest(changeRequest);
            var ation = that.initiate();
            ation.fireChangeRequest(changeRequest);
            ation.commit();
        };

        that.fireChangeRequest = sourceWrapModelChanged(that.fireChangeRequest, threadLocal);
        fluid.bindRequestChange(that);
        fluid.bindELMethods(that);

        // TODO: modelChanged has been moved to new model for firing. Once we abolish "guards", fireAgglomerated can go too.
        // Possibly also all the prepareFireEvent/wrapListener/fireSpec nonsense too.
        function fireAgglomerated(eventName, formName, changes, args, accpos, matchpos) {
            var fireSpec = makeFireSpec();
            for (var i = 0; i < changes.length; ++i) {
                prepareFireEvent(eventName, changes[i].path, fireSpec, changes[i]);
            }
            for (var j = 0; j < fireSpec[formName].length; ++j) {
                var spec = fireSpec[formName][j];
                if (accpos !== undefined) {
                    args[accpos] = spec.accumulate;
                }
                if (matchpos !== undefined) {
                    args[matchpos] = spec.match;
                }
                var ret = spec.listener.apply(null, args);
                if (ret === false) {
                    return false;
                }
            }
        }

        that.initiate = function (newModel) {
            var cancelled = false;
            var changes = [];
            if (options.thin) {
                newModel = holder.model;
            }
            else {
                newModel = newModel || {};
                fluid.model.copyModel(newModel, holder.model);
            }
            var ation = {
                commit: function () {
                    var oldModel;
                    if (cancelled) {
                        return false;
                    }
                    var ret = fireAgglomerated("postGuards", "transListeners", changes, [newModel, null, ation], 1);
                    if (ret === false || cancelled) {
                        return false;
                    }
                    if (options.thin) {
                        oldModel = holder.model;
                    }
                    else {
                        oldModel = {};
                        fluid.model.copyModel(oldModel, holder.model);
                        fluid.clear(holder.model);
                        fluid.model.copyModel(holder.model, newModel);
                    }
                    fireAgglomerated("modelChanged", "all", changes, [holder.model, oldModel, null, null], 2, 3);
                },
                fireChangeRequest: function (changeRequest) {
                    preFireChangeRequest(changeRequest);
                    if (options.cullUnchanged && fluid.model.isNullChange(holder.model, changeRequest, options.resolverGetConfig)) {
                        return;
                    }
                    var wrapper = makeGuardWrapper(options.cullUnchanged);
                    var prevent = fireEvent("guards", changeRequest.path, [newModel, changeRequest, ation], wrapper);
                    if (prevent === false && !(wrapper && wrapper.culled)) {
                        cancelled = true;
                    }
                    if (!cancelled) {
                        if (!(wrapper && wrapper.culled)) {
                            fluid.model.applyChangeRequest(newModel, changeRequest, options.resolverSetConfig);
                            changes.push(changeRequest);
                        }
                    }
                }
            };

            ation.fireChangeRequest = sourceWrapModelChanged(ation.fireChangeRequest, threadLocal);
            fluid.bindRequestChange(ation);

            return ation;
        };

        that.hasChangeSource = function (source) {
            return threadLocal().sources[source] > 0;
        };

        return that;
    };

    /** Old "SuperApplier" implementation - will be removed in 1.5 **/

    fluid.makeSuperApplier = function () {
        var subAppliers = [];
        var that = {};
        that.addSubApplier = function (path, subApplier) {
            subAppliers.push({path: path, subApplier: subApplier});
        };
        that.fireChangeRequest = function (request) {
            for (var i = 0; i < subAppliers.length; ++i) {
                var path = subAppliers[i].path;
                if (request.path.indexOf(path) === 0) {
                    var subpath = request.path.substring(path.length + 1);
                    var subRequest = fluid.copy(request);
                    subRequest.path = subpath;
                    // TODO: Deal with the as yet unsupported case of an EL rvalue DAR
                    subAppliers[i].subApplier.fireChangeRequest(subRequest);
                }
            }
        };
        fluid.bindRequestChange(that);
        return that;
    };

    fluid.attachModel = function (baseModel, path, model) {
        var segs = fluid.model.parseEL(path);
        for (var i = 0; i < segs.length - 1; ++i) {
            var seg = segs[i];
            var subModel = baseModel[seg];
            if (!subModel) {
                baseModel[seg] = subModel = {};
            }
            baseModel = subModel;
        }
        baseModel[segs[segs.length - 1]] = model;
    };

    fluid.assembleModel = function (modelSpec) {
        var model = {};
        var superApplier = fluid.makeSuperApplier();
        var togo = {model: model, applier: superApplier};
        for (var path in modelSpec) {
            var rec = modelSpec[path];
            fluid.attachModel(model, path, rec.model);
            if (rec.applier) {
                superApplier.addSubApplier(path, rec.applier);
            }
        }
        return togo;
    };

})(jQuery, fluid_1_5);
;/*
Copyright 2010 University of Toronto
Copyright 2010-2011 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid_1_5 = fluid_1_5 || {};
var fluid = fluid || fluid_1_5;

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("fluid.model.transform");

    /** Grade definitions for standard transformation function hierarchy **/

    fluid.defaults("fluid.transformFunction", {
        gradeNames: "fluid.function"
    });

    // uses standard layout and workflow involving inputPath
    fluid.defaults("fluid.standardInputTransformFunction", {
        gradeNames: "fluid.transformFunction"
    });

    fluid.defaults("fluid.standardOutputTransformFunction", {
        gradeNames: "fluid.transformFunction"
    });

    fluid.defaults("fluid.multiInputTransformFunction", {
        gradeNames: "fluid.transformFunction"
    });

    // uses the standard layout and workflow involving inputPath and outputPath
    fluid.defaults("fluid.standardTransformFunction", {
        gradeNames: ["fluid.standardInputTransformFunction", "fluid.standardOutputTransformFunction"]
    });

    fluid.defaults("fluid.lens", {
        gradeNames: "fluid.transformFunction",
        invertConfiguration: null
        // this function method returns "inverted configuration" rather than actually performing inversion
        // TODO: harmonise with strategy used in VideoPlayer_framework.js
    });

    /***********************************
     * Base utilities for transformers *
     ***********************************/

    // unsupported, NON-API function
    fluid.model.transform.pathToRule = function (inputPath) {
        return {
            transform: {
                type: "fluid.transforms.value",
                inputPath: inputPath
            }
        };
    };

    // unsupported, NON-API function
    fluid.model.transform.literalValueToRule = function (value) {
        return {
            transform: {
                type: "fluid.transforms.literalValue",
                value: value
            }
        };
    };

    /** Accepts two fully escaped paths, either of which may be empty or null **/
    fluid.model.composePaths = function (prefix, suffix) {
        prefix = prefix === 0 ? "0" : prefix || "";
        suffix = suffix === 0 ? "0" : suffix || "";
        return !prefix ? suffix : (!suffix ? prefix : prefix + "." + suffix);
    };

    fluid.model.transform.accumulateInputPath = function (inputPath, transform, paths) {
        if (inputPath !== undefined) {
            paths.push(fluid.model.composePaths(transform.inputPrefix, inputPath));
        }
    };

    fluid.model.transform.accumulateStandardInputPath = function (input, transformSpec, transform, paths) {
        fluid.model.transform.getValue(undefined, transformSpec[input], transform);
        fluid.model.transform.accumulateInputPath(transformSpec[input + "Path"], transform, paths);
    };

    fluid.model.transform.accumulateMultiInputPaths = function (inputVariables, transformSpec, transform, paths) {
        fluid.each(inputVariables, function (v, k) {
            fluid.model.transform.accumulateStandardInputPath(k, transformSpec, transform, paths);
        });
    };

    fluid.model.transform.getValue = function (inputPath, value, transform) {
        var togo;
        if (inputPath !== undefined) { // NB: We may one day want to reverse the crazy jQuery-like convention that "no path means root path"
            togo = fluid.get(transform.source, fluid.model.composePaths(transform.inputPrefix, inputPath), transform.resolverGetConfig);
        }
        if (togo === undefined) {
            togo = fluid.isPrimitive(value) ? value : transform.expand(value);
        }
        return togo;
    };

    // distinguished value which indicates that a transformation rule supplied a
    // non-default output path, and so the user should be prevented from making use of it
    // in a compound transform definition
    fluid.model.transform.NONDEFAULT_OUTPUT_PATH_RETURN = {};

    fluid.model.transform.setValue = function (userOutputPath, value, transform, merge) {
        // avoid crosslinking to input object - this might be controlled by a "nocopy" option in future
        var toset = fluid.copy(value);
        var outputPath = fluid.model.composePaths(transform.outputPrefix, userOutputPath);
        // TODO: custom resolver config here to create non-hash output model structure
        if (toset !== undefined) {
            transform.applier.requestChange(outputPath, toset, merge ? "MERGE" : undefined);
        }
        return userOutputPath ? fluid.model.transform.NONDEFAULT_OUTPUT_PATH_RETURN : toset;
    };

    /* Resolves the <key> given as parameter by looking up the path <key>Path in the object
     * to be transformed. If not present, it resolves the <key> by using the literal value if primitive,
     * or expanding otherwise. <def> defines the default value if unableto resolve the key. If no
     * default value is given undefined is returned
     */
    fluid.model.transform.resolveParam = function (transformSpec, transform, key, def) {
        var val = fluid.model.transform.getValue(transformSpec[key + "Path"], transformSpec[key], transform);
        return (val !== undefined) ? val : def;
    };

    // TODO: Incomplete implementation which only checks expected paths
    fluid.deepEquals = function (expected, actual, stats) {
        if (fluid.isPrimitive(expected)) {
            if (expected === actual) {
                ++stats.matchCount;
            } else {
                ++stats.mismatchCount;
                stats.messages.push("Value mismatch at path " + stats.path + ": expected " + expected + " actual " + actual);
            }
        }
        else {
            if (typeof(expected) !== typeof(actual)) {
                ++stats.mismatchCount;
                stats.messages.push("Type mismatch at path " + stats.path + ": expected " + typeof(expected)  + " actual " + typeof(actual));
            } else {
                fluid.each(expected, function (value, key) {
                    stats.pathOps.push(key);
                    fluid.deepEquals(expected[key], actual[key], stats);
                    stats.pathOps.pop(key);
                });
            }
        }
    };

    fluid.model.transform.matchValue = function (expected, actual) {
        if (fluid.isPrimitive(expected)) {
            return expected === actual ? 1 : 0;
        } else {
            var stats = {
                matchCount: 0,
                mismatchCount: 0,
                messages: []
            };
            fluid.model.makePathStack(stats, "path");
            fluid.deepEquals(expected, actual, stats);
            return stats.matchCount;
        }
    };

    // unsupported, NON-API function
    fluid.model.transform.compareMatches = function (speca, specb) {
        return specb.matchCount - speca.matchCount;
    };

    fluid.firstDefined = function (a, b) {
        return a === undefined ? b : a;
    };


    // TODO: prefixApplier is a transform which is currently unused and untested
    fluid.model.transform.prefixApplier = function (transformSpec, transform) {
        if (transformSpec.inputPrefix) {
            transform.inputPrefixOp.push(transformSpec.inputPrefix);
        }
        if (transformSpec.outputPrefix) {
            transform.outputPrefixOp.push(transformSpec.outputPrefix);
        }
        transform.expand(transformSpec.value);
        if (transformSpec.inputPrefix) {
            transform.inputPrefixOp.pop();
        }
        if (transformSpec.outputPrefix) {
            transform.outputPrefixOp.pop();
        }
    };

    fluid.defaults("fluid.model.transform.prefixApplier", {
        gradeNames: ["fluid.transformFunction"]
    });

    // unsupported, NON-API function
    fluid.model.makePathStack = function (transform, prefixName) {
        var stack = transform[prefixName + "Stack"] = [];
        transform[prefixName] = "";
        return {
            push: function (prefix) {
                var newPath = fluid.model.composePaths(transform[prefixName], prefix);
                stack.push(transform[prefixName]);
                transform[prefixName] = newPath;
            },
            pop: function () {
                transform[prefixName] = stack.pop();
            }
        };
    };

    fluid.model.transform.aliasStandardInput = function (transformSpec) {
        return { // alias input and value, and their paths
            value: transformSpec.value === undefined ? transformSpec.input : transformSpec.value,
            valuePath: transformSpec.valuePath === undefined ? transformSpec.inputPath : transformSpec.valuePath
        };
    };

    // unsupported, NON-API function
    fluid.model.transform.doTransform = function (transformSpec, transform, transformOpts) {
        var expdef = transformOpts.defaults;
        var transformFn = fluid.getGlobalValue(transformOpts.typeName);
        if (typeof(transformFn) !== "function") {
            fluid.fail("Transformation record specifies transformation function with name " +
                transformSpec.type + " which is not a function - ", transformFn);
        }
        if (!fluid.hasGrade(expdef, "fluid.transformFunction")) {
            // If no suitable grade is set up, assume that it is intended to be used as a standardTransformFunction
            expdef = fluid.defaults("fluid.standardTransformFunction");
        }
        var transformArgs = [transformSpec, transform];
        if (fluid.hasGrade(expdef, "fluid.standardInputTransformFunction")) {
            var valueHolder = fluid.model.transform.aliasStandardInput(transformSpec);
            var expanded = fluid.model.transform.getValue(valueHolder.valuePath, valueHolder.value, transform);

            transformArgs.unshift(expanded);
            //if the function has no input, the result is considered undefined, and this is returned
            if (expanded === undefined) {
                return undefined;
            }
        } else if (fluid.hasGrade(expdef, "fluid.multiInputTransformFunction")) {
            var inputs = {};
            fluid.each(expdef.inputVariables, function (v, k) {
                inputs[k] = function () {
                    var input = fluid.model.transform.getValue(transformSpec[k + "Path"], transformSpec[k], transform);
                    // if no match, assign default if one exists (v != null)
                    input = (input === undefined && v !== null) ? v : input;
                    return input;
                };
            });
            transformArgs.unshift(inputs);
        }
        var transformed = transformFn.apply(null, transformArgs);
        if (fluid.hasGrade(expdef, "fluid.standardOutputTransformFunction")) {
            // "doOutput" flag is currently set nowhere, but could be used in future
            var outputPath = transformSpec.outputPath !== undefined ? transformSpec.outputPath : (transformOpts.doOutput ? "" : undefined);
            if (outputPath !== undefined && transformed !== undefined) {
                //If outputPath is given in the expander we want to:
                // (1) output to the document
                // (2) return undefined, to ensure that expanders higher up in the hierarchy doesn't attempt to output it again
                fluid.model.transform.setValue(transformSpec.outputPath, transformed, transform, transformSpec.merge);
                transformed = undefined;
            }
        }
        return transformed;
    };

    // unsupported, NON-API function
    fluid.model.transform.expandWildcards = function (transform, source) {
        fluid.each(source, function (value, key) {
            var q = transform.queuedTransforms;
            transform.pathOp.push(fluid.pathUtil.escapeSegment(key.toString()));
            for (var i = 0; i < q.length; ++i) {
                if (fluid.pathUtil.matchPath(q[i].matchPath, transform.path, true)) {
                    var esCopy = fluid.copy(q[i].transformSpec);
                    if (esCopy.inputPath === undefined || fluid.model.transform.hasWildcard(esCopy.inputPath)) {
                        esCopy.inputPath = "";
                    }
                    // TODO: allow some kind of interpolation for output path
                    // TODO: Also, we now require outputPath to be specified in these cases for output to be produced as well.. Is that something we want to continue with?
                    transform.inputPrefixOp.push(transform.path);
                    transform.outputPrefixOp.push(transform.path);
                    var transformOpts = fluid.model.transform.lookupType(esCopy.type);
                    var result = fluid.model.transform.doTransform(esCopy, transform, transformOpts);
                    if (result !== undefined) {
                        fluid.model.transform.setValue(null, result, transform);
                    }
                    transform.outputPrefixOp.pop();
                    transform.inputPrefixOp.pop();
                }
            }
            if (!fluid.isPrimitive(value)) {
                fluid.model.transform.expandWildcards(transform, value);
            }
            transform.pathOp.pop();
        });
    };

    // unsupported, NON-API function
    fluid.model.transform.hasWildcard = function (path) {
        return typeof(path) === "string" && path.indexOf("*") !== -1;
    };

    // unsupported, NON-API function
    fluid.model.transform.maybePushWildcard = function (transformSpec, transform) {
        var hw = fluid.model.transform.hasWildcard;
        var matchPath;
        if (hw(transformSpec.inputPath)) {
            matchPath = fluid.model.composePaths(transform.inputPrefix, transformSpec.inputPath);
        }
        else if (hw(transform.outputPrefix) || hw(transformSpec.outputPath)) {
            matchPath = fluid.model.composePaths(transform.outputPrefix, transformSpec.outputPath);
        }

        if (matchPath) {
            transform.queuedTransforms.push({transformSpec: transformSpec, outputPrefix: transform.outputPrefix, inputPrefix: transform.inputPrefix, matchPath: matchPath});
            return true;
        }
        return false;
    };

    fluid.model.sortByKeyLength = function (inObject) {
        var keys = fluid.keys(inObject);
        return keys.sort(fluid.compareStringLength(true));
    };

    // Three handler functions operating the (currently) three different processing modes
    // unsupported, NON-API function
    fluid.model.transform.handleTransformStrategy = function (transformSpec, transform, transformOpts) {
        if (fluid.model.transform.maybePushWildcard(transformSpec, transform)) {
            return;
        }
        else {
            return fluid.model.transform.doTransform(transformSpec, transform, transformOpts);
        }
    };
    // unsupported, NON-API function
    fluid.model.transform.handleInvertStrategy = function (transformSpec, transform, transformOpts) {
        var invertor = transformOpts.defaults && transformOpts.defaults.invertConfiguration;
        if (invertor) {
            var inverted = fluid.invokeGlobalFunction(invertor, [transformSpec, transform]);
            transform.inverted.push(inverted);
        }
    };

    // unsupported, NON-API function
    fluid.model.transform.handleCollectStrategy = function (transformSpec, transform, transformOpts) {
        var defaults = transformOpts.defaults;
        var standardInput = fluid.hasGrade(defaults, "fluid.standardInputTransformFunction");
        var multiInput = fluid.hasGrade(defaults, "fluid.multiInputTransformFunction");

        if (standardInput) {
            fluid.model.transform.accumulateStandardInputPath("input", transformSpec, transform, transform.inputPaths);
        } else if (multiInput) {
            fluid.model.transform.accumulateMultiInputPaths(defaults.inputVariables, transformSpec, transform, transform.inputPaths);
        } else {
            var collector = defaults.collectInputPaths;
            if (collector) {
                var collected = fluid.makeArray(fluid.invokeGlobalFunction(collector, [transformSpec, transform]));
                transform.inputPaths = transform.inputPaths.concat(collected);
            }
        }
    };

    fluid.model.transform.lookupType = function (typeName, transformSpec) {
        if (!typeName) {
            fluid.fail("Transformation record is missing a type name: ", transformSpec);
        }
        if (typeName.indexOf(".") === -1) {
            typeName = "fluid.transforms." + typeName;
        }
        var defaults = fluid.defaults(typeName);
        return { defaults: defaults, typeName: typeName};
    };

    // unsupported, NON-API function
    fluid.model.transform.processRule = function (rule, transform) {
        if (typeof(rule) === "string") {
            rule = fluid.model.transform.pathToRule(rule);
        }
        // special dispensation to allow "literalValue" at top level
        else if (rule.literalValue && transform.outputPrefix !== "") {
            rule = fluid.model.transform.literalValueToRule(rule.literalValue);
        }
        var togo;
        if (rule.transform) {
            var transformSpec, transformOpts;

            if (fluid.isArrayable(rule.transform)) {
                // if the transform holds an array, each transformer within that is responsible for its own output
                var transforms = rule.transform;
                togo = undefined;
                for (var i = 0; i < transforms.length; ++i) {
                    transformSpec = transforms[i];
                    transformOpts = fluid.model.transform.lookupType(transformSpec.type);
                    transform.transformHandler(transformSpec, transform, transformOpts);
                }
            } else {
                // else we just have a normal single transform which will return 'undefined' as a flag to defeat cascading output
                transformSpec = rule.transform;
                transformOpts = fluid.model.transform.lookupType(transformSpec.type);
                togo = transform.transformHandler(transformSpec, transform, transformOpts);
            }
        }
        // if rule is an array, save path for later use in schema strategy on final applier (so output will be interpreted as array)
        if (fluid.isArrayable(rule)) {
            transform.collectedFlatSchemaOpts = transform.collectedFlatSchemaOpts || {};
            transform.collectedFlatSchemaOpts[transform.outputPrefix] = "array";
        }
        fluid.each(rule, function (value, key) {
            if (key !== "transform") {
                transform.outputPrefixOp.push(key);
                var togo = transform.expand(value, transform);
                // Value expanders and arrays as rules implicitly outputs, unless they have nothing (undefined) to output
                if (togo !== undefined) {
                    fluid.model.transform.setValue(null, togo, transform);
                    // ensure that expanders further up does not try to output this value as well.
                    togo = undefined;
                }
                transform.outputPrefixOp.pop();
            }
        });
        return togo;
    };

    // unsupported, NON-API function
    // 3rd arg is disused by the framework and always defaults to fluid.model.transform.processRule
    fluid.model.transform.makeStrategy = function (transform, handleFn, transformFn) {
        transformFn = transformFn || fluid.model.transform.processRule;
        transform.expand = function (rules) {
            return transformFn(rules, transform);
        };
        transform.outputPrefixOp = fluid.model.makePathStack(transform, "outputPrefix");
        transform.inputPrefixOp = fluid.model.makePathStack(transform, "inputPrefix");
        transform.transformHandler = handleFn;
    };

    fluid.model.transform.invertConfiguration = function (rules) {
        var transform = {
            inverted: []
        };
        fluid.model.transform.makeStrategy(transform, fluid.model.transform.handleInvertStrategy);
        transform.expand(rules);
        return {
            transform: transform.inverted
        };
    };

    fluid.model.transform.collectInputPaths = function (rules) {
        var transform = {
            inputPaths: []
        };
        fluid.model.transform.makeStrategy(transform, fluid.model.transform.handleCollectStrategy);
        transform.expand(rules);
        return transform.inputPaths;
    };

    // unsupported, NON-API function
    fluid.model.transform.flatSchemaStrategy = function (flatSchema, getConfig) {
        var keys = fluid.model.sortByKeyLength(flatSchema);
        return function (root, segment, index, segs) {
            var path = getConfig.parser.compose.apply(null, segs.slice(0, index));
          // TODO: clearly this implementation could be much more efficient
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i];
                if (fluid.pathUtil.matchPath(key, path, true) !== null) {
                    return flatSchema[key];
                }
            }
        };
    };

    // unsupported, NON-API function
    fluid.model.transform.defaultSchemaValue = function (schemaValue) {
        var type = fluid.isPrimitive(schemaValue) ? schemaValue : schemaValue.type;
        return type === "array" ? [] : {};
    };

    // unsupported, NON-API function
    fluid.model.transform.isomorphicSchemaStrategy = function (source, getConfig) {
        return function (root, segment, index, segs) {
            var existing = fluid.get(source, segs.slice(0, index), getConfig);
            return fluid.isArrayable(existing) ? "array" : "object";
        };
    };

    // unsupported, NON-API function
    fluid.model.transform.decodeStrategy = function (source, options, getConfig) {
        if (options.isomorphic) {
            return fluid.model.transform.isomorphicSchemaStrategy(source, getConfig);
        }
        else if (options.flatSchema) {
            return fluid.model.transform.flatSchemaStrategy(options.flatSchema, getConfig);
        }
    };

    // unsupported, NON-API function
    fluid.model.transform.schemaToCreatorStrategy = function (strategy) {
        return function (root, segment, index, segs) {
            if (root[segment] === undefined) {
                var schemaValue = strategy(root, segment, index, segs);
                root[segment] = fluid.model.transform.defaultSchemaValue(schemaValue);
                return root[segment];
            }
        };
    };

    /** Transforms a model by a sequence of rules. Parameters as for fluid.model.transform,
     * only with an array accepted for "rules"
     */
    fluid.model.transform.sequence = function (source, rules, options) {
        for (var i = 0; i < rules.length; ++i) {
            source = fluid.model.transform(source, rules[i], options);
        }
        return source;
    };

    fluid.model.compareByPathLength = function (changea, changeb) {
        var pdiff = changea.path.length - changeb.path.length;
        return pdiff === 0 ? changea.sequence - changeb.sequence : pdiff;
    };

   /** Fires an accumulated set of change requests in increasing order of target pathlength
     */
    fluid.model.fireSortedChanges = function (changes, applier) {
        changes.sort(fluid.model.compareByPathLength);
        fluid.requestChanges(applier, changes);
    };

    /**
     * Transforms a model based on a specified expansion rules objects.
     * Rules objects take the form of:
     *   {
     *       "target.path": "value.el.path" || {
     *          transform: {
     *              type: "transform.function.path",
     *               ...
     *           }
     *       }
     *   }
     *
     * @param {Object} source the model to transform
     * @param {Object} rules a rules object containing instructions on how to transform the model
     * @param {Object} options a set of rules governing the transformations. At present this may contain
     * the values <code>isomorphic: true</code> indicating that the output model is to be governed by the
     * same schema found in the input model, or <code>flatSchema</code> holding a flat schema object which
     * consists of a hash of EL path specifications with wildcards, to the values "array"/"object" defining
     * the schema to be used to construct missing trunk values.
     */
    fluid.model.transformWithRules = function (source, rules, options) {
        options = options || {};

        var getConfig = fluid.model.escapedGetConfig;

        var schemaStrategy = fluid.model.transform.decodeStrategy(source, options, getConfig);

        var transform = {
            source: source,
            target: schemaStrategy ? fluid.model.transform.defaultSchemaValue(schemaStrategy(null, "", 0, [""])) : {},
            resolverGetConfig: getConfig,
            collectedFlatSchemaOpts: undefined, //to hold options for flat schema collected during transforms
            queuedChanges: [],
            queuedTransforms: [] // TODO: This is used only by wildcard applier - explain its operation
        };
        fluid.model.transform.makeStrategy(transform, fluid.model.transform.handleTransformStrategy);
        transform.applier = {
            fireChangeRequest: function (changeRequest) {
                changeRequest.sequence = transform.queuedChanges.length;
                transform.queuedChanges.push(changeRequest);
            }
        };
        fluid.bindRequestChange(transform.applier);

        transform.expand(rules);

        var setConfig = fluid.copy(fluid.model.escapedSetConfig);
        // Modify schemaStrategy if we collected flat schema options for the setConfig of finalApplier
        if (transform.collectedFlatSchemaOpts !== undefined) {
            $.extend(transform.collectedFlatSchemaOpts, options.flatSchema);
            schemaStrategy = fluid.model.transform.flatSchemaStrategy(transform.collectedFlatSchemaOpts, getConfig);
        }
        setConfig.strategies = [fluid.model.defaultFetchStrategy, schemaStrategy ? fluid.model.transform.schemaToCreatorStrategy(schemaStrategy)
                : fluid.model.defaultCreatorStrategy];
        transform.finalApplier = options.finalApplier || fluid.makeChangeApplier(transform.target, {resolverSetConfig: setConfig});

        if (transform.queuedTransforms.length > 0) {
            transform.typeStack = [];
            transform.pathOp = fluid.model.makePathStack(transform, "path");
            fluid.model.transform.expandWildcards(transform, source);
        }
        fluid.model.fireSortedChanges(transform.queuedChanges, transform.finalApplier);
        return transform.target;
    };

    $.extend(fluid.model.transformWithRules, fluid.model.transform);
    fluid.model.transform = fluid.model.transformWithRules;

    /** Utility function to produce a standard options transformation record for a single set of rules **/
    fluid.transformOne = function (rules) {
        return {
            transformOptions: {
                transformer: "fluid.model.transformWithRules",
                config: rules
            }
        };
    };

    /** Utility function to produce a standard options transformation record for multiple rules to be applied in sequence **/
    fluid.transformMany = function (rules) {
        return {
            transformOptions: {
                transformer: "fluid.model.transform.sequence",
                config: rules
            }
        };
    };

})(jQuery, fluid_1_5);
;/*
Copyright 2010 University of Toronto
Copyright 2010-2011 OCAD University
Copyright 2013 Raising the Floor - International

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid_1_5 = fluid_1_5 || {};
var fluid = fluid || fluid_1_5;

(function ($, fluid) {
    "use strict";

    fluid.registerNamespace("fluid.model.transform");
    fluid.registerNamespace("fluid.transforms");

    /**********************************
     * Standard transformer functions *
     **********************************/

    fluid.defaults("fluid.transforms.value", {
        gradeNames: "fluid.standardTransformFunction",
        invertConfiguration: "fluid.transforms.value.invert"
    });

    fluid.transforms.value = fluid.identity;

    fluid.transforms.value.invert = function (transformSpec, transform) {
        var togo = fluid.copy(transformSpec);
        // TODO: this will not behave correctly in the face of compound "value" which contains
        // further transforms
        togo.inputPath = fluid.model.composePaths(transform.outputPrefix, transformSpec.outputPath);
        togo.outputPath = fluid.model.composePaths(transform.inputPrefix, transformSpec.inputPath);
        return togo;
    };

    // Export the use of the "value" transform under the "identity" name for FLUID-5293
    fluid.transforms.identity = fluid.transforms.value;
    fluid.defaults("fluid.transforms.identity", {
        gradeNames: "fluid.transforms.value"
    });

    fluid.defaults("fluid.transforms.literalValue", {
        gradeNames: "fluid.standardOutputTransformFunction"
    });

    fluid.transforms.literalValue = function (transformSpec) {
        return transformSpec.value;
    };


    fluid.defaults("fluid.transforms.arrayValue", {
        gradeNames: "fluid.standardTransformFunction"
    });

    fluid.transforms.arrayValue = fluid.makeArray;


    fluid.defaults("fluid.transforms.count", {
        gradeNames: "fluid.standardTransformFunction"
    });

    fluid.transforms.count = function (value) {
        return fluid.makeArray(value).length;
    };


    fluid.defaults("fluid.transforms.round", {
        gradeNames: "fluid.standardTransformFunction"
    });

    fluid.transforms.round = function (value) {
        return Math.round(value);
    };


    fluid.defaults("fluid.transforms.delete", {
        gradeNames: "fluid.transformFunction"
    });

    fluid.transforms["delete"] = function (transformSpec, transform) {
        var outputPath = fluid.model.composePaths(transform.outputPrefix, transformSpec.outputPath);
        transform.applier.requestChange(outputPath, null, "DELETE");
    };


    fluid.defaults("fluid.transforms.firstValue", {
        gradeNames: "fluid.transformFunction"
    });

    fluid.transforms.firstValue = function (transformSpec, transform) {
        if (!transformSpec.values || !transformSpec.values.length) {
            fluid.fail("firstValue transformer requires an array of values at path named \"values\", supplied", transformSpec);
        }
        for (var i = 0; i < transformSpec.values.length; i++) {
            var value = transformSpec.values[i];
            // TODO: problem here - all of these transforms will have their side-effects (setValue) even if only one is chosen
            var expanded = transform.expand(value);
            if (expanded !== undefined) {
                return expanded;
            }
        }
    };

    fluid.defaults("fluid.transforms.linearScale", {
        gradeNames: [ "fluid.multiInputTransformFunction", "fluid.standardOutputTransformFunction", "fluid.lens" ],
        invertConfiguration: "fluid.transforms.linearScale.invert",
        inputVariables: {
            value: null,
            factor: 1,
            offset: 0
        }
    });

    /* simple linear transformation */
    fluid.transforms.linearScale = function (inputs) {
        var value = inputs.value();
        var factor = inputs.factor();
        var offset = inputs.offset();

        if (typeof(value) !== "number" || typeof(factor) !== "number" || typeof(offset) !== "number") {
            return undefined;
        }
        return value * factor + offset;
    };

    /* TODO: This inversion doesn't work if the value and factors are given as paths in the source model */
    fluid.transforms.linearScale.invert = function  (transformSpec, transform) {
        var togo = fluid.copy(transformSpec);

        if (togo.factor) {
            togo.factor = (togo.factor === 0) ? 0 : 1 / togo.factor;
        }
        if (togo.offset) {
            togo.offset = - togo.offset * (togo.factor !== undefined ? togo.factor : 1);
        }
        // TODO: This rubbish should be done by the inversion machinery by itself. We shouldn't have to repeat it in every
        // inversion rule
        togo.valuePath = fluid.model.composePaths(transform.outputPrefix, transformSpec.outputPath);
        togo.outputPath = fluid.model.composePaths(transform.inputPrefix, transformSpec.valuePath);
        return togo;
    };

    fluid.defaults("fluid.transforms.binaryOp", {
        gradeNames: [ "fluid.multiInputTransformFunction", "fluid.standardOutputTransformFunction" ],
        inputVariables: {
            left: null,
            right: null
        }
    });

    fluid.transforms.binaryLookup = {
        "===": function (a, b) { return a === b; },
        "!==": function (a, b) { return a !== b; },
        "<=": function (a, b) { return a <= b; },
        "<": function (a, b) { return a < b; },
        ">=": function (a, b) { return a >= b; },
        ">": function (a, b) { return a > b; },
        "+": function (a, b) { return a + b; },
        "-": function (a, b) { return a - b; },
        "*": function (a, b) { return a * b; },
        "/": function (a, b) { return a / b; },
        "%": function (a, b) { return a % b; },
        "&&": function (a, b) { return a && b; },
        "||": function (a, b) { return a || b; }
    };

    fluid.transforms.binaryOp = function (inputs, transformSpec, transform) {
        var left = inputs.left();
        var right = inputs.right();

        var operator = fluid.model.transform.getValue(undefined, transformSpec.operator, transform);

        var fun = fluid.transforms.binaryLookup[operator];
        return (fun === undefined || left === undefined || right === undefined) ?
            undefined : fun(left, right);
    };

    fluid.defaults("fluid.transforms.condition", {
        gradeNames: [ "fluid.multiInputTransformFunction", "fluid.standardOutputTransformFunction" ],
        inputVariables: {
            "true": null,
            "false": null,
            "condition": null
        }
    });

    fluid.transforms.condition = function (inputs) {
        var condition = inputs.condition();
        if (condition === null) {
            return undefined;
        }

        return inputs[condition ? "true" : "false"]();
    };


    fluid.defaults("fluid.transforms.valueMapper", {
        gradeNames: ["fluid.transformFunction", "fluid.lens"],
        invertConfiguration: "fluid.transforms.valueMapper.invert",
        collectInputPaths: "fluid.transforms.valueMapper.collect"
    });

    // unsupported, NON-API function
    fluid.model.transform.matchValueMapperFull = function (outerValue, transformSpec, transform) {
        var o = transformSpec.options;
        if (o.length === 0) {
            fluid.fail("valueMapper supplied empty list of options: ", transformSpec);
        }
        if (o.length === 1) {
            return 0;
        }
        var matchPower = [];
        for (var i = 0; i < o.length; ++i) {
            var option = o[i];
            var value = fluid.firstDefined(fluid.model.transform.getValue(option.inputPath, undefined, transform),
                outerValue);
            var matchCount = fluid.model.transform.matchValue(option.undefinedInputValue ? undefined : option.inputValue, value);
            matchPower[i] = {index: i, matchCount: matchCount};
        }
        matchPower.sort(fluid.model.transform.compareMatches);
        return matchPower[0].matchCount === matchPower[1].matchCount ? -1 : matchPower[0].index;
    };

    fluid.transforms.valueMapper = function (transformSpec, transform) {
        if (!transformSpec.options) {
            fluid.fail("demultiplexValue requires a list or hash of options at path named \"options\", supplied ", transformSpec);
        }
        var value = fluid.model.transform.getValue(transformSpec.inputPath, undefined, transform);
        var deref = fluid.isArrayable(transformSpec.options) ? // long form with list of records
            function (testVal) {
                var index = fluid.model.transform.matchValueMapperFull(testVal, transformSpec, transform);
                return index === -1 ? null : transformSpec.options[index];
            } :
            function (testVal) {
                return transformSpec.options[testVal];
            };

        var indexed = deref(value);
        if (!indexed) {
            // if no branch matches, try again using this value - WARNING, this seriously
            // threatens invertibility
            indexed = deref(transformSpec.defaultInputValue);
        }
        if (!indexed) {
            return;
        }

        var outputPath = indexed.outputPath === undefined ? transformSpec.defaultOutputPath : indexed.outputPath;
        transform.outputPrefixOp.push(outputPath);
        var outputValue;
        if (fluid.isPrimitive(indexed)) {
            outputValue = indexed;
        } else {
            // if undefinedOutputValue is set, outputValue should be undefined
            if (indexed.undefinedOutputValue) {
                outputValue = undefined;
            } else {
                // get value from outputValue or outputValuePath. If none is found set the outputValue to be that of defaultOutputValue (or undefined)
                outputValue = fluid.model.transform.resolveParam(indexed, transform, "outputValue", undefined);
                outputValue = (outputValue === undefined) ? transformSpec.defaultOutputValue : outputValue;
            }
        }
        //output if outputPath or defaultOutputPath have been specified and the relevant child hasn't done the outputting
        if (typeof(outputPath) === "string" && outputValue !== undefined) {
            fluid.model.transform.setValue(undefined, outputValue, transform, transformSpec.merge);
            outputValue = undefined;
        }
        transform.outputPrefixOp.pop();
        return outputValue;
    };

    fluid.transforms.valueMapper.invert = function (transformSpec, transform) {
        var options = [];
        var togo = {
            type: "fluid.transforms.valueMapper",
            options: options
        };
        var isArray = fluid.isArrayable(transformSpec.options);
        var findCustom = function (name) {
            return fluid.find(transformSpec.options, function (option) {
                if (option[name]) {
                    return true;
                }
            });
        };
        var anyCustomOutput = findCustom("outputPath");
        var anyCustomInput = findCustom("inputPath");
        if (!anyCustomOutput) {
            togo.inputPath = fluid.model.composePaths(transform.outputPrefix, transformSpec.outputPath);
        }
        if (!anyCustomInput) {
            togo.defaultOutputPath = fluid.model.composePaths(transform.inputPrefix, transformSpec.inputPath);
        }
        var def = fluid.firstDefined;
        fluid.each(transformSpec.options, function (option, key) {
            var outOption = {};
            var origInputValue = def(isArray ? option.inputValue : key, transformSpec.defaultInputValue);
            if (origInputValue === undefined) {
                fluid.fail("Failure inverting configuration for valueMapper - inputValue could not be resolved for record " + key + ": ", transformSpec);
            }
            outOption.outputValue = origInputValue;
            var origOutputValue = def(option.outputValue, transformSpec.defaultOutputValue);
            outOption.inputValue = fluid.model.transform.getValue(option.outputValuePath, origOutputValue, transform);
            if (anyCustomOutput) {
                outOption.inputPath = fluid.model.composePaths(transform.outputPrefix, def(option.outputPath, transformSpec.outputPath));
            }
            if (anyCustomInput) {
                outOption.outputPath = fluid.model.composePaths(transform.inputPrefix, def(option.inputPath, transformSpec.inputPath));
            }
            if (option.outputValuePath) {
                outOption.inputValuePath = option.outputValuePath;
            }
            options.push(outOption);
        });
        return togo;
    };

    fluid.transforms.valueMapper.collect = function (transformSpec, transform) {
        var togo = [];
        fluid.model.transform.accumulateInputPath(transformSpec.inputPath, transform, togo);
        fluid.each(transformSpec.options, function (option) {
            fluid.model.transform.accumulateInputPath(option.inputPath, transform, togo);
        });
        return togo;
    };

    /* -------- arrayToSetMembership and setMembershipToArray ---------------- */

    fluid.defaults("fluid.transforms.arrayToSetMembership", {
        gradeNames: ["fluid.standardInputTransformFunction", "fluid.lens"],
        invertConfiguration: "fluid.transforms.arrayToSetMembership.invert"
    });


    fluid.transforms.arrayToSetMembership = function (value, transformSpec, transform) {
        var options = transformSpec.options;

        if (!value || !fluid.isArrayable(value)) {
            fluid.fail("arrayToSetMembership didn't find array at inputPath nor passed as value.", transformSpec);
        }
        if (!options) {
            fluid.fail("arrayToSetMembership requires an options block set");
        }

        if (transformSpec.presentValue === undefined) {
            transformSpec.presentValue = true;
        }

        if (transformSpec.missingValue === undefined) {
            transformSpec.missingValue = false;
        }

        fluid.each(options, function (outPath, key) {
            // write to output path given in options the value <presentValue> or <missingValue> depending on whether key is found in user input
            var outVal = ($.inArray(key, value) !== -1) ? transformSpec.presentValue : transformSpec.missingValue;
            fluid.model.transform.setValue(outPath, outVal, transform);
        });
        // TODO: Why does this transform make no return?
    };

    fluid.transforms.arrayToSetMembership.invert = function (transformSpec, transform) {
        var togo = fluid.copy(transformSpec);
        delete togo.inputPath;
        togo.type = "fluid.transforms.setMembershipToArray";
        togo.outputPath = fluid.model.composePaths(transform.inputPrefix, transformSpec.inputPath);
        var newOptions = {};
        fluid.each(transformSpec.options, function (path, oldKey) {
            var newKey = fluid.model.composePaths(transform.outputPrefix, path);
            newOptions[newKey] = oldKey;
        });
        togo.options = newOptions;
        return togo;
    };

    fluid.defaults("fluid.transforms.setMembershipToArray", {
        gradeNames: ["fluid.standardOutputTransformFunction"]
    });

    fluid.transforms.setMembershipToArray = function (transformSpec, transform) {
        var options = transformSpec.options;

        if (!options) {
            fluid.fail("setMembershipToArray requires an options block specified");
        }

        if (transformSpec.presentValue === undefined) {
            transformSpec.presentValue = true;
        }

        if (transformSpec.missingValue === undefined) {
            transformSpec.missingValue = false;
        }

        var outputArr = [];
        fluid.each(options, function (arrVal, inPath) {
            var val = fluid.model.transform.getValue(inPath, undefined, transform);
            if (val === transformSpec.presentValue) {
                outputArr.push(arrVal);
            }
        });
        return outputArr;
    };

    /* -------- objectToArray and arrayToObject -------------------- */

    /**
     * Transforms the given array to an object.
     * Uses the transformSpec.options.key values from each object within the array as new keys.
     *
     * For example, with transformSpec.key = "name" and an input object like this:
     *
     * {
     *   b: [
     *     { name: b1, v: v1 },
     *     { name: b2, v: v2 }
     *   ]
     * }
     *
     * The output will be:
     * {
     *   b: {
     *     b1: {
     *       v: v1
     *     }
     *   },
     *   {
     *     b2: {
     *       v: v2
     *     }
     *   }
     * }
     */
    fluid.model.transform.applyPaths = function (operation, pathOp, paths) {
        for (var i = 0; i < paths.length; ++i) {
            if (operation === "push") {
                pathOp.push(paths[i]);
            } else {
                pathOp.pop();
            }
        }
    };

    fluid.model.transform.expandInnerValues = function (inputPath, outputPath, transform, innerValues) {
        var inputPrefixOp = transform.inputPrefixOp;
        var outputPrefixOp = transform.outputPrefixOp;
        var apply = fluid.model.transform.applyPaths;

        apply("push", inputPrefixOp, inputPath);
        apply("push", outputPrefixOp, outputPath);
        var expanded = {};
        fluid.each(innerValues, function (innerValue) {
            var expandedInner = transform.expand(innerValue);
            if (!fluid.isPrimitive(expandedInner)) {
                $.extend(true, expanded, expandedInner);
            } else {
                expanded = expandedInner;
            }
        });
        apply("pop", outputPrefixOp, outputPath);
        apply("pop", inputPrefixOp, inputPath);

        return expanded;
    };


    fluid.defaults("fluid.transforms.arrayToObject", {
        gradeNames: ["fluid.standardTransformFunction", "fluid.lens" ],
        invertConfiguration: "fluid.transforms.arrayToObject.invert"
    });

    fluid.transforms.arrayToObject = function (arr, transformSpec, transform) {
        if (transformSpec.key === undefined) {
            fluid.fail("arrayToObject requires a 'key' option.", transformSpec);
        }
        if (!fluid.isArrayable(arr)) {
            fluid.fail("arrayToObject didn't find array at inputPath.", transformSpec);
        }
        var newHash = {};
        var pivot = transformSpec.key;

        fluid.each(arr, function (v, k) {
            // check that we have a pivot entry in the object and it's a valid type:
            var newKey = v[pivot];
            var keyType = typeof(newKey);
            if (keyType !== "string" && keyType !== "boolean" && keyType !== "number") {
                fluid.fail("arrayToObject encountered untransformable array due to missing or invalid key", v);
            }
            // use the value of the key element as key and use the remaining content as value
            var content = fluid.copy(v);
            delete content[pivot];
            // fix sub Arrays if needed:
            if (transformSpec.innerValue) {
                content = fluid.model.transform.expandInnerValues([transform.inputPrefix, transformSpec.inputPath, k.toString()],
                    [newKey], transform, transformSpec.innerValue);
            }
            newHash[newKey] = content;
        });
        return newHash;
    };

    fluid.transforms.arrayToObject.invert = function (transformSpec, transform) {
        var togo = fluid.copy(transformSpec);
        togo.type = "fluid.transforms.objectToArray";
        togo.inputPath = fluid.model.composePaths(transform.outputPrefix, transformSpec.outputPath);
        togo.outputPath = fluid.model.composePaths(transform.inputPrefix, transformSpec.inputPath);
        // invert transforms from innerValue as well:
        // TODO: The Model Transformations framework should be capable of this, but right now the
        // issue is that we use a "private contract" to operate the "innerValue" slot. We need to
        // spend time thinking of how this should be formalised
        if (togo.innerValue) {
            var innerValue = togo.innerValue;
            for (var i = 0; i < innerValue.length; ++i) {
                innerValue[i] = fluid.model.transform.invertConfiguration(innerValue[i]);
            }
        }
        return togo;
    };


    fluid.defaults("fluid.transforms.objectToArray", {
        gradeNames: "fluid.standardTransformFunction"
    });

    /**
     * Transforms an object into array of objects.
     * This performs the inverse transform of fluid.transforms.arrayToObject.
     */
    fluid.transforms.objectToArray = function (hash, transformSpec, transform) {
        if (transformSpec.key === undefined) {
            fluid.fail("objectToArray requires a 'key' option.", transformSpec);
        }

        var newArray = [];
        var pivot = transformSpec.key;

        fluid.each(hash, function (v, k) {
            var content = {};
            content[pivot] = k;
            if (transformSpec.innerValue) {
                v = fluid.model.transform.expandInnerValues([transformSpec.inputPath, k], [transformSpec.outputPath, newArray.length.toString()],
                    transform, transformSpec.innerValue);
            }
            $.extend(true, content, v);
            newArray.push(content);
        });
        return newArray;
    };

    fluid.defaults("fluid.transforms.limitRange", {
        gradeNames: "fluid.standardTransformFunction"
    });

    fluid.transforms.limitRange = function (value, transformSpec) {
        var min = transformSpec.min;
        if (min !== undefined) {
            var excludeMin = transformSpec.excludeMin || 0;
            min += excludeMin;
            if (value < min) {
                value = min;
            }
        }
        var max = transformSpec.max;
        if (max !== undefined) {
            var excludeMax = transformSpec.excludeMax || 0;
            max -= excludeMax;
            if (value > max) {
                value = max;
            }
        }
        return value;
    };

    fluid.defaults("fluid.transforms.free", {
        gradeNames: "fluid.transformFunction"
    });

    fluid.transforms.free = function (transformSpec) {
        var args = fluid.makeArray(transformSpec.args);
        return fluid.invokeGlobalFunction(transformSpec.func, args);
    };

})(jQuery, fluid_1_5);
;/*
Copyright 2010-2011 Lucendo Development Ltd.
Copyright 2010-2011 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/** This file contains functions which depend on the presence of a DOM document
 *  and which depend on the contents of Fluid.js **/

var fluid_1_5 = fluid_1_5 || {};

(function ($, fluid) {
    "use strict";

    // The base grade for fluid.viewComponent and fluid.viewRelayComponent - will be removed again once the old ChangeApplier is eliminated
    fluid.defaults("fluid.commonViewComponent", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        initFunction: "fluid.initView",
        argumentMap: {
            container: 0,
            options: 1
        },
        members: { // Used to allow early access to DOM binder via IoC, but to also avoid triggering evaluation of selectors
            dom: "@expand:fluid.initDomBinder({that}, {that}.options.selectors)"
        }
    });

    fluid.defaults("fluid.viewComponent", {
        gradeNames: ["fluid.commonViewComponent", "fluid.standardComponent", "autoInit"]
    });

    // a version of the standard grade fluid.viewComponent that uses the new FLUID-5024 ChangeApplier and model relay system - this will be the default
    // in Fluid 2.0 and be renamed back to fluid.viewComponent
    fluid.defaults("fluid.viewRelayComponent", {
        gradeNames: ["fluid.commonViewComponent", "fluid.standardRelayComponent", "autoInit"]
    });

    // unsupported, NON-API function
    fluid.dumpSelector = function (selectable) {
        return typeof (selectable) === "string" ? selectable :
            selectable.selector ? selectable.selector : "";
    };

    // unsupported, NON-API function
    // NOTE: this function represents a temporary strategy until we have more integrated IoC debugging.
    // It preserves the current framework behaviour for the 1.4 release, but provides a more informative
    // diagnostic - in fact, it is perfectly acceptable for a component's creator to return no value and
    // the failure is really in assumptions in fluid.initComponent. Revisit this issue for 1.5
    fluid.diagnoseFailedView = function (componentName, that, options, args) {
        if (!that && (fluid.hasGrade(options, "fluid.viewComponent") || fluid.hasGrade(options, "fluid.viewRelayComponent"))) {
            var container = fluid.wrap(args[1]);
            var message1 = "Instantiation of autoInit component with type " + componentName + " failed, since ";
            if (!container) {
                fluid.fail(message1 + " container argument is empty");
            }
            else if (container.length === 0) {
                fluid.fail(message1 + "selector \"", fluid.dumpSelector(args[1]), "\" did not match any markup in the document");
            } else {
                fluid.fail(message1 + " component creator function did not return a value");
            }
        }
    };

    fluid.checkTryCatchParameter = function () {
        var location = window.location || { search: "", protocol: "file:" };
        var GETparams = location.search.slice(1).split("&");
        return fluid.find(GETparams, function (param) {
            if (param.indexOf("notrycatch") === 0) {
                return true;
            }
        }) === true;
    };

    fluid.notrycatch = fluid.checkTryCatchParameter();


    /**
     * Wraps an object in a jQuery if it isn't already one. This function is useful since
     * it ensures to wrap a null or otherwise falsy argument to itself, rather than the
     * often unhelpful jQuery default of returning the overall document node.
     *
     * @param {Object} obj the object to wrap in a jQuery
     * @param {jQuery} userJQuery the jQuery object to use for the wrapping, optional - use the current jQuery if absent
     */
    fluid.wrap = function (obj, userJQuery) {
        userJQuery = userJQuery || $;
        return ((!obj || obj.jquery) ? obj : userJQuery(obj));
    };

    /**
     * If obj is a jQuery, this function will return the first DOM element within it. Otherwise, the object will be returned unchanged.
     *
     * @param {jQuery} obj the jQuery instance to unwrap into a pure DOM element
     */
    fluid.unwrap = function (obj) {
        return obj && obj.jquery && obj.length === 1 ? obj[0] : obj;
    };

    /**
     * Fetches a single container element and returns it as a jQuery.
     *
     * @param {String||jQuery||element} containerSpec an id string, a single-element jQuery, or a DOM element specifying a unique container
     * @param {Boolean} fallible <code>true</code> if an empty container is to be reported as a valid condition
     * @return a single-element jQuery of container
     */
    fluid.container = function (containerSpec, fallible, userJQuery) {
        if (userJQuery) {
            containerSpec = fluid.unwrap(containerSpec);
        }
        var container = fluid.wrap(containerSpec, userJQuery);
        if (fallible && (!container || container.length === 0)) {
            return null;
        }

        if (!container || !container.jquery || container.length !== 1) {
            if (typeof (containerSpec) !== "string") {
                containerSpec = container.selector;
            }
            var count = container.length !== undefined ? container.length : 0;
            fluid.fail((count > 1 ? "More than one (" + count + ") container elements were"
                    : "No container element was") + " found for selector " + containerSpec);
        }
        if (!fluid.isDOMNode(container[0])) {
            fluid.fail("fluid.container was supplied a non-jQueryable element");
        }

        return container;
    };

    /**
     * Creates a new DOM Binder instance, used to locate elements in the DOM by name.
     *
     * @param {Object} container the root element in which to locate named elements
     * @param {Object} selectors a collection of named jQuery selectors
     */
    fluid.createDomBinder = function (container, selectors) {
        // don't put on a typename to avoid confusing primitive visitComponentChildren
        var cache = {}, that = {id: fluid.allocateGuid()};
        var userJQuery = container.constructor;

        function cacheKey(name, thisContainer) {
            return fluid.allocateSimpleId(thisContainer) + "-" + name;
        }

        function record(name, thisContainer, result) {
            cache[cacheKey(name, thisContainer)] = result;
        }

        that.locate = function (name, localContainer) {
            var selector, thisContainer, togo;

            selector = selectors[name];
            thisContainer = localContainer ? localContainer : container;
            if (!thisContainer) {
                fluid.fail("DOM binder invoked for selector " + name + " without container");
            }

            if (!selector) {
                return thisContainer;
            }

            if (typeof (selector) === "function") {
                togo = userJQuery(selector.call(null, fluid.unwrap(thisContainer)));
            } else {
                togo = userJQuery(selector, thisContainer);
            }
            if (togo.get(0) === document) {
                togo = [];
            }
            if (!togo.selector) {
                togo.selector = selector;
                togo.context = thisContainer;
            }
            togo.selectorName = name;
            record(name, thisContainer, togo);
            return togo;
        };
        that.fastLocate = function (name, localContainer) {
            var thisContainer = localContainer ? localContainer : container;
            var key = cacheKey(name, thisContainer);
            var togo = cache[key];
            return togo ? togo : that.locate(name, localContainer);
        };
        that.clear = function () {
            cache = {};
        };
        that.refresh = function (names, localContainer) {
            var thisContainer = localContainer ? localContainer : container;
            if (typeof names === "string") {
                names = [names];
            }
            if (thisContainer.length === undefined) {
                thisContainer = [thisContainer];
            }
            for (var i = 0; i < names.length; ++i) {
                for (var j = 0; j < thisContainer.length; ++j) {
                    that.locate(names[i], thisContainer[j]);
                }
            }
        };
        that.resolvePathSegment = that.locate;

        return that;
    };

    /** Expect that jQuery selector query has resulted in a non-empty set of
     * results. If none are found, this function will fail with a diagnostic message,
     * with the supplied message prepended.
     */
    fluid.expectFilledSelector = function (result, message) {
        if (result && result.length === 0 && result.jquery) {
            fluid.fail(message + ": selector \"" + result.selector + "\" with name " + result.selectorName +
                       " returned no results in context " + fluid.dumpEl(result.context));
        }
    };

    /**
     * The central initialiation method called as the first act of every Fluid
     * component. This function automatically merges user options with defaults,
     * attaches a DOM Binder to the instance, and configures events.
     *
     * @param {String} componentName The unique "name" of the component, which will be used
     * to fetch the default options from store. By recommendation, this should be the global
     * name of the component's creator function.
     * @param {jQueryable} container A specifier for the single root "container node" in the
     * DOM which will house all the markup for this component.
     * @param {Object} userOptions The configuration options for this component.
     */
     // 4th argument is NOT SUPPORTED, see comments for initLittleComponent
    fluid.initView = function (componentName, containerSpec, userOptions, localOptions) {
        var container = fluid.container(containerSpec, true);
        fluid.expectFilledSelector(container, "Error instantiating component with name \"" + componentName);
        if (!container) {
            return null;
        }
        // Need to ensure container is set early, without relying on an IoC mechanism - rethink this with asynchrony
        var receiver = function (that) {
            that.container = container;
        };
        var that = fluid.initLittleComponent(componentName, userOptions, localOptions || {gradeNames: ["fluid.viewComponent"]}, receiver);

        if (!that.dom) {
            fluid.initDomBinder(that);
        }
        // TODO: cannot afford a mutable container - put this into proper workflow
        var userJQuery = that.options.jQuery; // Do it a second time to correct for jQuery injection
        // if (userJQuery) {
        //    container = fluid.container(containerSpec, true, userJQuery);
        // }
        fluid.log("Constructing view component " + componentName + " with container " + container.constructor.expando +
            (userJQuery ? " user jQuery " + userJQuery.expando : "") + " env: " + $.expando);

        return that;
    };

    /**
     * Creates a new DOM Binder instance for the specified component and mixes it in.
     *
     * @param {Object} that the component instance to attach the new DOM Binder to
     */
    fluid.initDomBinder = function (that, selectors) {
        that.dom = fluid.createDomBinder(that.container, selectors || that.options.selectors || {});
        that.locate = that.dom.locate;
        return that.dom;
    };

    // DOM Utilities.

    /**
     * Finds the nearest ancestor of the element that passes the test
     * @param {Element} element DOM element
     * @param {Function} test A function which takes an element as a parameter and return true or false for some test
     */
    fluid.findAncestor = function (element, test) {
        element = fluid.unwrap(element);
        while (element) {
            if (test(element)) {
                return element;
            }
            element = element.parentNode;
        }
    };

    fluid.findForm = function (node) {
        return fluid.findAncestor(node, function (element) {
            return element.nodeName.toLowerCase() === "form";
        });
    };

    /** A utility with the same signature as jQuery.text and jQuery.html, but without the API irregularity
     * that treats a single argument of undefined as different to no arguments */
    // in jQuery 1.7.1, jQuery pulled the same dumb trick with $.text() that they did with $.val() previously,
    // see comment in fluid.value below
    fluid.each(["text", "html"], function (method) {
        fluid[method] = function (node, newValue) {
            node = $(node);
            return newValue === undefined ? node[method]() : node[method](newValue);
        };
    });

    /** A generalisation of jQuery.val to correctly handle the case of acquiring and
     * setting the value of clustered radio button/checkbox sets, potentially, given
     * a node corresponding to just one element.
     */
    fluid.value = function (nodeIn, newValue) {
        var node = fluid.unwrap(nodeIn);
        var multiple = false;
        if (node.nodeType === undefined && node.length > 1) {
            node = node[0];
            multiple = true;
        }
        if ("input" !== node.nodeName.toLowerCase() || !/radio|checkbox/.test(node.type)) {
            // resist changes to contract of jQuery.val() in jQuery 1.5.1 (see FLUID-4113)
            return newValue === undefined ? $(node).val() : $(node).val(newValue);
        }
        var name = node.name;
        if (name === undefined) {
            fluid.fail("Cannot acquire value from node " + fluid.dumpEl(node) + " which does not have name attribute set");
        }
        var elements;
        if (multiple) {
            elements = nodeIn;
        } else {
            elements = node.ownerDocument.getElementsByName(name);
            var scope = fluid.findForm(node);
            elements = $.grep(elements, function (element) {
                if (element.name !== name) {
                    return false;
                }
                return !scope || fluid.dom.isContainer(scope, element);
            });
        }
        if (newValue !== undefined) {
            if (typeof(newValue) === "boolean") {
                newValue = (newValue ? "true" : "false");
            }
          // jQuery gets this partially right, but when dealing with radio button array will
          // set all of their values to "newValue" rather than setting the checked property
          // of the corresponding control.
            $.each(elements, function () {
                this.checked = (newValue instanceof Array ?
                    $.inArray(this.value, newValue) !== -1 : newValue === this.value);
            });
        } else { // this part jQuery will not do - extracting value from <input> array
            var checked = $.map(elements, function (element) {
                return element.checked ? element.value : null;
            });
            return node.type === "radio" ? checked[0] : checked;
        }
    };


    fluid.BINDING_ROOT_KEY = "fluid-binding-root";

    /** Recursively find any data stored under a given name from a node upwards
     * in its DOM hierarchy **/

    fluid.findData = function (elem, name) {
        while (elem) {
            var data = $.data(elem, name);
            if (data) {
                return data;
            }
            elem = elem.parentNode;
        }
    };

    fluid.bindFossils = function (node, data, fossils) {
        $.data(node, fluid.BINDING_ROOT_KEY, {data: data, fossils: fossils});
    };

    fluid.boundPathForNode = function (node, fossils) {
        node = fluid.unwrap(node);
        var key = node.name || node.id;
        var record = fossils[key];
        return record ? record.EL : null;
    };

   /** "Automatically" apply to whatever part of the data model is
     * relevant, the changed value received at the given DOM node*/
    fluid.applyBoundChange = function (node, newValue, applier) {
        node = fluid.unwrap(node);
        if (newValue === undefined) {
            newValue = fluid.value(node);
        }
        if (node.nodeType === undefined && node.length > 0) {
            node = node[0];
        } // assume here that they share name and parent
        var root = fluid.findData(node, fluid.BINDING_ROOT_KEY);
        if (!root) {
            fluid.fail("Bound data could not be discovered in any node above " + fluid.dumpEl(node));
        }
        var name = node.name;
        var fossil = root.fossils[name];
        if (!fossil) {
            fluid.fail("No fossil discovered for name " + name + " in fossil record above " + fluid.dumpEl(node));
        }
        if (typeof(fossil.oldvalue) === "boolean") { // deal with the case of an "isolated checkbox"
            newValue = newValue[0] ? true : false;
        }
        var EL = root.fossils[name].EL;
        if (applier) {
            applier.fireChangeRequest({path: EL, value: newValue, source: "DOM:" + node.id});
        } else {
            fluid.set(root.data, EL, newValue);
        }
    };


    /**
     * Returns a jQuery object given the id of a DOM node. In the case the element
     * is not found, will return an empty list.
     */
    fluid.jById = function (id, dokkument) {
        dokkument = dokkument && dokkument.nodeType === 9 ? dokkument : document;
        var element = fluid.byId(id, dokkument);
        var togo = element ? $(element) : [];
        togo.selector = "#" + id;
        togo.context = dokkument;
        return togo;
    };

    /**
     * Returns an DOM element quickly, given an id
     *
     * @param {Object} id the id of the DOM node to find
     * @param {Document} dokkument the document in which it is to be found (if left empty, use the current document)
     * @return The DOM element with this id, or null, if none exists in the document.
     */
    fluid.byId = function (id, dokkument) {
        dokkument = dokkument && dokkument.nodeType === 9 ? dokkument : document;
        var el = dokkument.getElementById(id);
        if (el) {
        // Use element id property here rather than attribute, to work around FLUID-3953
            if (el.id !== id) {
                fluid.fail("Problem in document structure - picked up element " +
                    fluid.dumpEl(el) + " for id " + id +
                    " without this id - most likely the element has a name which conflicts with this id");
            }
            return el;
        } else {
            return null;
        }
    };

    /**
     * Returns the id attribute from a jQuery or pure DOM element.
     *
     * @param {jQuery||Element} element the element to return the id attribute for
     */
    fluid.getId = function (element) {
        return fluid.unwrap(element).id;
    };

    /**
     * Allocate an id to the supplied element if it has none already, by a simple
     * scheme resulting in ids "fluid-id-nnnn" where nnnn is an increasing integer.
     */

    fluid.allocateSimpleId = function (element) {
        var simpleId = "fluid-id-" + fluid.allocateGuid();
        if (!element || fluid.isPrimitive(element)) {
            return simpleId;
        }
        element = fluid.unwrap(element);
        if (!element.id) {
            element.id = simpleId;
        }
        return element.id;
    };

    fluid.defaults("fluid.ariaLabeller", {
        labelAttribute: "aria-label",
        liveRegionMarkup: "<div class=\"liveRegion fl-offScreen-hidden\" aria-live=\"polite\"></div>",
        liveRegionId: "fluid-ariaLabeller-liveRegion",
        events: {
            generateLiveElement: "unicast"
        },
        listeners: {
            generateLiveElement: "fluid.ariaLabeller.generateLiveElement"
        }
    });

    fluid.ariaLabeller = function (element, options) {
        var that = fluid.initView("fluid.ariaLabeller", element, options);

        that.update = function (newOptions) {
            newOptions = newOptions || that.options;
            that.container.attr(that.options.labelAttribute, newOptions.text);
            if (newOptions.dynamicLabel) {
                var live = fluid.jById(that.options.liveRegionId);
                if (live.length === 0) {
                    live = that.events.generateLiveElement.fire(that);
                }
                live.text(newOptions.text);
            }
        };

        that.update();
        return that;
    };

    fluid.ariaLabeller.generateLiveElement = function (that) {
        var liveEl = $(that.options.liveRegionMarkup);
        liveEl.prop("id", that.options.liveRegionId);
        $("body").append(liveEl);
        return liveEl;
    };

    var LABEL_KEY = "aria-labelling";

    fluid.getAriaLabeller = function (element) {
        element = $(element);
        var that = fluid.getScopedData(element, LABEL_KEY);
        return that;
    };

    /** Manages an ARIA-mediated label attached to a given DOM element. An
     * aria-labelledby attribute and target node is fabricated in the document
     * if they do not exist already, and a "little component" is returned exposing a method
     * "update" that allows the text to be updated. */

    fluid.updateAriaLabel = function (element, text, options) {
        options = $.extend({}, options || {}, {text: text});
        var that = fluid.getAriaLabeller(element);
        if (!that) {
            that = fluid.ariaLabeller(element, options);
            fluid.setScopedData(element, LABEL_KEY, that);
        } else {
            that.update(options);
        }
        return that;
    };

    /** "Global Dismissal Handler" for the entire page. Attaches a click handler to the
     * document root that will cause dismissal of any elements (typically dialogs) which
     * have registered themselves. Dismissal through this route will automatically clean up
     * the record - however, the dismisser themselves must take care to deregister in the case
     * dismissal is triggered through the dialog interface itself. This component can also be
     * automatically configured by fluid.deadMansBlur by means of the "cancelByDefault" option */

    var dismissList = {};

    $(document).click(function (event) {
        var target = fluid.resolveEventTarget(event);
        while (target) {
            if (dismissList[target.id]) {
                return;
            }
            target = target.parentNode;
        }
        fluid.each(dismissList, function (dismissFunc, key) {
            dismissFunc(event);
            delete dismissList[key];
        });
    });
    // TODO: extend a configurable equivalent of the above dealing with "focusin" events

    /** Accepts a free hash of nodes and an optional "dismissal function".
     * If dismissFunc is set, this "arms" the dismissal system, such that when a click
     * is received OUTSIDE any of the hierarchy covered by "nodes", the dismissal function
     * will be executed.
     */
    fluid.globalDismissal = function (nodes, dismissFunc) {
        fluid.each(nodes, function (node) {
          // Don't bother to use the real id if it is from a foreign document - we will never receive events
          // from it directly in any case - and foreign documents may be under the control of malign fiends
          // such as tinyMCE who allocate the same id to everything
            var id = fluid.unwrap(node).ownerDocument === document? fluid.allocateSimpleId(node) : fluid.allocateGuid();
            if (dismissFunc) {
                dismissList[id] = dismissFunc;
            }
            else {
                delete dismissList[id];
            }
        });
    };

    /** Provides an abstraction for determing the current time.
     * This is to provide a fix for FLUID-4762, where IE6 - IE8
     * do not support Date.now().
     */
    fluid.now = function () {
        return Date.now ? Date.now() : (new Date()).getTime();
    };


    /** Sets an interation on a target control, which morally manages a "blur" for
     * a possibly composite region.
     * A timed blur listener is set on the control, which waits for a short period of
     * time (options.delay, defaults to 150ms) to discover whether the reason for the
     * blur interaction is that either a focus or click is being serviced on a nominated
     * set of "exclusions" (options.exclusions, a free hash of elements or jQueries).
     * If no such event is received within the window, options.handler will be called
     * with the argument "control", to service whatever interaction is required of the
     * blur.
     */

    fluid.deadMansBlur = function (control, options) {
        // TODO: This should be rewritten as a proper component
        var that = {options: $.extend(true, {}, fluid.defaults("fluid.deadMansBlur"), options)};
        that.blurPending = false;
        that.lastCancel = 0;
        that.canceller = function (event) {
            fluid.log("Cancellation through " + event.type + " on " + fluid.dumpEl(event.target));
            that.lastCancel = fluid.now();
            that.blurPending = false;
        };
        that.noteProceeded = function () {
            fluid.globalDismissal(that.options.exclusions);
        };
        that.reArm = function () {
            fluid.globalDismissal(that.options.exclusions, that.proceed);
        };
        that.addExclusion = function (exclusions) {
            fluid.globalDismissal(exclusions, that.proceed);
        };
        that.proceed = function (event) {
            fluid.log("Direct proceed through " + event.type + " on " + fluid.dumpEl(event.target));
            that.blurPending = false;
            that.options.handler(control);
        };
        fluid.each(that.options.exclusions, function (exclusion) {
            exclusion = $(exclusion);
            fluid.each(exclusion, function (excludeEl) {
                $(excludeEl).bind("focusin", that.canceller).
                    bind("fluid-focus", that.canceller).
                    click(that.canceller).mousedown(that.canceller);
    // Mousedown is added for FLUID-4212, as a result of Chrome bug 6759, 14204
            });
        });
        if (!that.options.cancelByDefault) {
            $(control).bind("focusout", function (event) {
                fluid.log("Starting blur timer for element " + fluid.dumpEl(event.target));
                var now = fluid.now();
                fluid.log("back delay: " + (now - that.lastCancel));
                if (now - that.lastCancel > that.options.backDelay) {
                    that.blurPending = true;
                }
                setTimeout(function () {
                    if (that.blurPending) {
                        that.options.handler(control);
                    }
                }, that.options.delay);
            });
        }
        else {
            that.reArm();
        }
        return that;
    };

    fluid.defaults("fluid.deadMansBlur", {
        delay: 150,
        backDelay: 100
    });

})(jQuery, fluid_1_5);
;/*
Copyright 2010-2011 OCAD University
Copyright 2010-2011 Lucendo Development Ltd.

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

var fluid_1_5 = fluid_1_5 || {};

(function ($, fluid) {
    "use strict";

    /** Framework-global caching state for fluid.fetchResources **/

    var resourceCache = {};

    var pendingClass = {};

    /** Accepts a hash of structures with free keys, where each entry has either
     * href/url or nodeId set - on completion, callback will be called with the populated
     * structure with fetched resource text in the field "resourceText" for each
     * entry. Each structure may contain "options" holding raw options to be forwarded
     * to jQuery.ajax().
     */

    fluid.fetchResources = function(resourceSpecs, callback, options) {
        var that = fluid.initLittleComponent("fluid.fetchResources", options);
        that.resourceSpecs = resourceSpecs;
        that.callback = callback;
        that.operate = function() {
            fluid.fetchResources.fetchResourcesImpl(that);
        };
        fluid.each(resourceSpecs, function(resourceSpec, key) {
            resourceSpec.recurseFirer = fluid.event.getEventFirer(null, null, "I/O completion for resource \"" + key + "\"");
            resourceSpec.recurseFirer.addListener(that.operate);
            if (resourceSpec.url && !resourceSpec.href) {
                resourceSpec.href = resourceSpec.url;
            }
        });
        if (that.options.amalgamateClasses) {
            fluid.fetchResources.amalgamateClasses(resourceSpecs, that.options.amalgamateClasses, that.operate);
        }
        that.operate();
        return that;
    };

    /*
     * This function is unsupported: It is not really intended for use by implementors.
     */
    // Add "synthetic" elements of *this* resourceSpec list corresponding to any
    // still pending elements matching the PROLEPTICK CLASS SPECIFICATION supplied
    fluid.fetchResources.amalgamateClasses = function(specs, classes, operator) {
        fluid.each(classes, function(clazz) {
            var pending = pendingClass[clazz];
            fluid.each(pending, function(pendingrec, canon) {
                specs[clazz+"!"+canon] = pendingrec;
                pendingrec.recurseFirer.addListener(operator);
            });
        });
    };

    /*
     * This function is unsupported: It is not really intended for use by implementors.
     */
    fluid.fetchResources.timeSuccessCallback = function(resourceSpec) {
        if (resourceSpec.timeSuccess && resourceSpec.options && resourceSpec.options.success) {
            var success = resourceSpec.options.success;
            resourceSpec.options.success = function() {
                var startTime = new Date();
                var ret = success.apply(null, arguments);
                fluid.log("External callback for URL " + resourceSpec.href + " completed - callback time: " +
                        (new Date().getTime() - startTime.getTime()) + "ms");
                return ret;
            };
        }
    };

    // TODO: Integrate punch-through from old Engage implementation
    function canonUrl(url) {
        return url;
    }

    fluid.fetchResources.clearResourceCache = function(url) {
        if (url) {
            delete resourceCache[canonUrl(url)];
        }
        else {
            fluid.clear(resourceCache);
        }
    };

    /*
     * This function is unsupported: It is not really intended for use by implementors.
     */
    fluid.fetchResources.handleCachedRequest = function(resourceSpec, response) {
        var canon = canonUrl(resourceSpec.href);
        var cached = resourceCache[canon];
        if (cached.$$firer$$) {
            fluid.log("Handling request for " + canon + " from cache");
            var fetchClass = resourceSpec.fetchClass;
            if (fetchClass && pendingClass[fetchClass]) {
                fluid.log("Clearing pendingClass entry for class " + fetchClass);
                delete pendingClass[fetchClass][canon];
            }
            resourceCache[canon] = response;
            cached.fire(response);
        }
    };

    /*
     * This function is unsupported: It is not really intended for use by implementors.
     */
    fluid.fetchResources.completeRequest = function(thisSpec) {
        thisSpec.queued = false;
        thisSpec.completeTime = new Date();
        fluid.log("Request to URL " + thisSpec.href + " completed - total elapsed time: " +
            (thisSpec.completeTime.getTime() - thisSpec.initTime.getTime()) + "ms");
        thisSpec.recurseFirer.fire();
    };

    /*
     * This function is unsupported: It is not really intended for use by implementors.
     */
    fluid.fetchResources.makeResourceCallback = function(thisSpec) {
        return {
            success: function(response) {
                thisSpec.resourceText = response;
                thisSpec.resourceKey = thisSpec.href;
                if (thisSpec.forceCache) {
                    fluid.fetchResources.handleCachedRequest(thisSpec, response);
                }
                fluid.fetchResources.completeRequest(thisSpec);
            },
            error: function(response, textStatus, errorThrown) {
                thisSpec.fetchError = {
                    status: response.status,
                    textStatus: response.textStatus,
                    errorThrown: errorThrown
                };
                fluid.fetchResources.completeRequest(thisSpec);
            }

        };
    };


    /*
     * This function is unsupported: It is not really intended for use by implementors.
     */
    fluid.fetchResources.issueCachedRequest = function(resourceSpec, options) {
        var canon = canonUrl(resourceSpec.href);
        var cached = resourceCache[canon];
        if (!cached) {
            fluid.log("First request for cached resource with url " + canon);
            cached = fluid.event.getEventFirer(null, null, "cache notifier for resource URL " + canon);
            cached.$$firer$$ = true;
            resourceCache[canon] = cached;
            var fetchClass = resourceSpec.fetchClass;
            if (fetchClass) {
                if (!pendingClass[fetchClass]) {
                    pendingClass[fetchClass] = {};
                }
                pendingClass[fetchClass][canon] = resourceSpec;
            }
            options.cache = false; // TODO: Getting weird "not modified" issues on Firefox
            $.ajax(options);
        }
        else {
            if (!cached.$$firer$$) {
                options.success(cached);
            }
            else {
                fluid.log("Request for cached resource which is in flight: url " + canon);
                cached.addListener(function(response) {
                    options.success(response);
                });
            }
        }
    };

    /*
     * This function is unsupported: It is not really intended for use by implementors.
     */
    // Compose callbacks in such a way that the 2nd, marked "external" will be applied
    // first if it exists, but in all cases, the first, marked internal, will be
    // CALLED WITHOUT FAIL
    fluid.fetchResources.composeCallbacks = function (internal, external) {
        return external ? (internal ?
        function () {
            try {
                external.apply(null, arguments);
            }
            catch (e) {
                fluid.log("Exception applying external fetchResources callback: " + e);
            }
            internal.apply(null, arguments); // call the internal callback without fail
        } : external ) : internal;
    };

    // unsupported, NON-API function
    fluid.fetchResources.composePolicy = function(target, source) {
        return fluid.fetchResources.composeCallbacks(target, source);
    };

    fluid.defaults("fluid.fetchResources.issueRequest", {
        mergePolicy: {
            success: fluid.fetchResources.composePolicy,
            error: fluid.fetchResources.composePolicy,
            url: "reverse"
        }
    });

    // unsupported, NON-API function
    fluid.fetchResources.issueRequest = function(resourceSpec, key) {
        var thisCallback = fluid.fetchResources.makeResourceCallback(resourceSpec);
        var options = {
            url:     resourceSpec.href,
            success: thisCallback.success,
            error:   thisCallback.error,
            dataType: resourceSpec.dataType || "text"
        };
        fluid.fetchResources.timeSuccessCallback(resourceSpec);
        options = fluid.merge(fluid.defaults("fluid.fetchResources.issueRequest").mergePolicy,
                      options, resourceSpec.options);
        resourceSpec.queued = true;
        resourceSpec.initTime = new Date();
        fluid.log("Request with key " + key + " queued for " + resourceSpec.href);

        if (resourceSpec.forceCache) {
            fluid.fetchResources.issueCachedRequest(resourceSpec, options);
        }
        else {
            $.ajax(options);
        }
    };

    fluid.fetchResources.fetchResourcesImpl = function(that) {
        var complete = true;
        var allSync = true;
        var resourceSpecs = that.resourceSpecs;
        for (var key in resourceSpecs) {
            var resourceSpec = resourceSpecs[key];
            if (!resourceSpec.options || resourceSpec.options.async) {
                allSync = false;
            }
            if (resourceSpec.href && !resourceSpec.completeTime) {
                if (!resourceSpec.queued) {
                    fluid.fetchResources.issueRequest(resourceSpec, key);
                }
                if (resourceSpec.queued) {
                    complete = false;
                }
            }
            else if (resourceSpec.nodeId && !resourceSpec.resourceText) {
                var node = document.getElementById(resourceSpec.nodeId);
                // upgrade this to somehow detect whether node is "armoured" somehow
                // with comment or CDATA wrapping
                resourceSpec.resourceText = fluid.dom.getElementText(node);
                resourceSpec.resourceKey = resourceSpec.nodeId;
            }
        }
        if (complete && that.callback && !that.callbackCalled) {
            that.callbackCalled = true;
            if ($.browser.mozilla && !allSync) {
                // Defer this callback to avoid debugging problems on Firefox
                setTimeout(function() {
                    that.callback(resourceSpecs);
                }, 1);
            }
            else {
                that.callback(resourceSpecs);
            }
        }
    };

    // TODO: This framework function is a stop-gap before the "ginger world" is capable of
    // asynchronous instantiation. It currently performs very poor fidelity expansion of a
    // component's options to discover "resources" only held in the static environment
    fluid.fetchResources.primeCacheFromResources = function(componentName) {
        var resources = fluid.defaults(componentName).resources;
        var expanded = (fluid.expandOptions ? fluid.expandOptions : fluid.identity)(fluid.copy(resources));
        fluid.fetchResources(expanded);
    };

    /** Utilities invoking requests for expansion **/
    fluid.registerNamespace("fluid.expander");

    /*
     * This function is unsupported: It is not really intended for use by implementors.
     */
    fluid.expander.makeDefaultFetchOptions = function (successdisposer, failid, options) {
        return $.extend(true, {dataType: "text"}, options, {
            success: function(response, environmentdisposer) {
                var json = JSON.parse(response);
                environmentdisposer(successdisposer(json));
            },
            error: function(response, textStatus) {
                fluid.log("Error fetching " + failid + ": " + textStatus);
            }
        });
    };

    /*
     * This function is unsupported: It is not really intended for use by implementors.
     */
    fluid.expander.makeFetchExpander = function (options) {
        return { expander: {
            type: "fluid.expander.deferredFetcher",
            href: options.url,
            options: fluid.expander.makeDefaultFetchOptions(options.disposer, options.url, options.options),
            resourceSpecCollector: "{resourceSpecCollector}",
            fetchKey: options.fetchKey
        }};
    };

    fluid.expander.deferredFetcher = function(deliverer, source, expandOptions) {
        var expander = source.expander;
        var spec = fluid.copy(expander);
        // fetch the "global" collector specified in the external environment to receive
        // this resourceSpec
        var collector = fluid.expand(expander.resourceSpecCollector, expandOptions);
        delete spec.type;
        delete spec.resourceSpecCollector;
        delete spec.fetchKey;
        var environmentdisposer = function(disposed) {
            deliverer(disposed);
        };
        // replace the callback which is there (taking 2 arguments) with one which
        // directly responds to the request, passing in the result and OUR "disposer" -
        // which once the user has processed the response (say, parsing JSON and repackaging)
        // finally deposits it in the place of the expander in the tree to which this reference
        // has been stored at the point this expander was evaluated.
        spec.options.success = function(response) {
            expander.options.success(response, environmentdisposer);
        };
        var key = expander.fetchKey || fluid.allocateGuid();
        collector[key] = spec;
        return fluid.NO_VALUE;
    };


})(jQuery, fluid_1_5);
;// -*- mode: javascript; tab-width: 2; indent-tabs-mode: nil; -*-

//------------------------------------------------------------------------------
// DSP API - JavaScript shim
//
// Copyright (C) 2012 Marcus Geelnard
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.
//------------------------------------------------------------------------------

"use strict";


//------------------------------------------------------------------------------
// interface DSP
//------------------------------------------------------------------------------

(function () {
    
    var g = typeof (window) !== "undefined" ? window : typeof (self) !== "undefined" ? self : global;
    
    (function () {
      if (g.DSP) return;

      var DSP = {};

      DSP.add = function (dst, x, y) {
        var k;
        if (y instanceof Float32Array)
          for (k = Math.min(dst.length, x.length, y.length) - 1; k >= 0; --k)
            dst[k] = x[k] + y[k];
        else
          for (k = Math.min(dst.length, x.length) - 1; k >= 0; --k)
            dst[k] = x[k] + y;
      };

      DSP.sub = function (dst, x, y) {
        var k;
        if (y instanceof Float32Array)
          for (k = Math.min(dst.length, x.length, y.length) - 1; k >= 0; --k)
            dst[k] = x[k] - y[k];
        else
          for (k = Math.min(dst.length, x.length) - 1; k >= 0; --k)
            dst[k] = x[k] - y;
      };

      DSP.mul = function (dst, x, y) {
        var k;
        if (y instanceof Float32Array)
          for (k = Math.min(dst.length, x.length, y.length) - 1; k >= 0; --k)
            dst[k] = x[k] * y[k];
        else
          for (k = Math.min(dst.length, x.length) - 1; k >= 0; --k)
            dst[k] = x[k] * y;
      };

      DSP.mulCplx = function (dstReal, dstImag, xReal, xImag, yReal, yImag) {
        var k, xr, xi, yr, yi;
        if (yReal instanceof Float32Array)
          for (k = Math.min(dstReal.length, dstImag.length, xReal.length, xImag.length, yReal.length, yImag.length) - 1; k >= 0; --k) {
            xr = xReal[k], xi = xImag[k], yr = yReal[k], yi = yImag[k];
            dstReal[k] = xr * yr - xi * yi;
            dstImag[k] = xr * yi + xi * yr;
          }
        else
          for (k = Math.min(dstReal.length, dstImag.length, xReal.length, xImag.length) - 1; k >= 0; --k) {
            xr = xReal[k], xi = xImag[k];
            dstReal[k] = xr * yReal - xi * yImag;
            dstImag[k] = xr * yImag + xi * yReal;
          }
      };

      DSP.div = function (dst, x, y) {
        var k;
        if (y instanceof Float32Array)
          for (k = Math.min(dst.length, x.length, y.length) - 1; k >= 0; --k)
            dst[k] = x[k] / y[k];
        else
          for (k = Math.min(dst.length, x.length) - 1; k >= 0; --k)
            dst[k] = x[k] / y;
      };

      DSP.divCplx = function (dstReal, dstImag, xReal, xImag, yReal, yImag) {
        var k, xr, xi, yr, yi, denom;
        if (yReal instanceof Float32Array)
          for (k = Math.min(dstReal.length, dstImag.length, xReal.length, xImag.length, yReal.length, yImag.length) - 1; k >= 0; --k) {
            xr = xReal[k], xi = xImag[k], yr = yReal[k], yi = yImag[k];
            denom = 1 / (yr * yr + yi * yi);
            dstReal[k] = (xr * yr + xi * yi) * denom;
            dstImag[k] = (xi * yr - xr * yi) * denom;
          }
        else {
          denom = 1 / (yReal * yReal + yImag * yImag);
          for (k = Math.min(dstReal.length, dstImag.length, xReal.length, xImag.length) - 1; k >= 0; --k) {
            xr = xReal[k], xi = xImag[k];
            dstReal[k] = (xr * yReal + xi * yImag) * denom;
            dstImag[k] = (xi * yReal - xr * yImag) * denom;
          }
        }
      };

      DSP.madd = function (dst, x, y, z) {
        var k;
        if (z instanceof Float32Array)
          for (k = Math.min(dst.length, x.length, y.length, z.length) - 1; k >= 0; --k)
            dst[k] = x[k] + y[k] * z[k];
        else
          for (k = Math.min(dst.length, x.length) - 1; k >= 0; --k)
            dst[k] = x[k] + y[k] * z;
      };

      DSP.abs = function (dst, x) {
        for (var k = Math.min(dst.length, x.length) - 1; k >= 0; --k)
          dst[k] = Math.abs(x[k]);
      };

      DSP.absCplx = function (dst, real, imag) {
        for (var k = Math.min(dst.length, real.length, imag.length) - 1; k >= 0; --k)
          dst[k] = Math.sqrt(real[k] * real[k] + imag[k] * imag[k]);
      };

      DSP.acos = function (dst, x) {
        for (var k = Math.min(dst.length, x.length) - 1; k >= 0; --k)
          dst[k] = Math.acos(x[k]);
      };

      DSP.asin = function (dst, x) {
        for (var k = Math.min(dst.length, x.length) - 1; k >= 0; --k)
          dst[k] = Math.asin(x[k]);
      };

      DSP.atan = function (dst, x) {
        for (var k = Math.min(dst.length, x.length) - 1; k >= 0; --k)
          dst[k] = Math.atan(x[k]);
      };

      DSP.atan2 = function (dst, y, x) {
        for (var k = Math.min(dst.length, x.length, y.length) - 1; k >= 0; --k)
          dst[k] = Math.atan2(y[k], x[k]);
      };

      DSP.ceil = function (dst, x) {
        for (var k = Math.min(dst.length, x.length) - 1; k >= 0; --k)
          dst[k] = Math.ceil(x[k]);
      };

      DSP.cos = function (dst, x) {
        for (var k = Math.min(dst.length, x.length) - 1; k >= 0; --k)
          dst[k] = Math.cos(x[k]);
      };

      DSP.exp = function (dst, x) {
        for (var k = Math.min(dst.length, x.length) - 1; k >= 0; --k)
          dst[k] = Math.exp(x[k]);
      };

      DSP.floor = function (dst, x) {
        for (var k = Math.min(dst.length, x.length) - 1; k >= 0; --k)
          dst[k] = Math.floor(x[k]);
      };

      DSP.log = function (dst, x) {
        for (var k = Math.min(dst.length, x.length) - 1; k >= 0; --k)
          dst[k] = Math.log(x[k]);
      };

      DSP.max = function (x) {
        var ret = -Infinity;
        for (var k = x.length - 1; k >= 0; --k) {
          var val = x[k];
          if (val > ret)
            ret = val;
        }
        return ret;
      };

      DSP.min = function (x) {
        var ret = Infinity;
        for (var k = x.length - 1; k >= 0; --k) {
          var val = x[k];
          if (val < ret)
            ret = val;
        }
        return ret;
      };

      DSP.pow = function (dst, x, y) {
        var k;
        if (y instanceof Float32Array)
          for (k = Math.min(dst.length, x.length, y.length) - 1; k >= 0; --k)
            dst[k] = Math.pow(x[k], y[k]);
        else {
          // Optimize for special cases
          if (y == 2)
            for (k = Math.min(dst.length, x.length) - 1; k >= 0; --k) {
              var val = x[k];
              dst[k] = val * val;
            }
          else if (y == 3)
            for (k = Math.min(dst.length, x.length) - 1; k >= 0; --k) {
              var val = x[k];
              dst[k] = val * val * val;
            }
          else if (y == 4)
            for (k = Math.min(dst.length, x.length) - 1; k >= 0; --k) {
              var val = x[k];
              val = val * val;
              dst[k] = val * val;
            }
          else if (y == -1)
            for (k = Math.min(dst.length, x.length) - 1; k >= 0; --k)
              dst[k] = 1 / x[k]
          else if (y == -2)
            for (k = Math.min(dst.length, x.length) - 1; k >= 0; --k) {
              var val = 1 / x[k];
              dst[k] = val * val;
            }
          else
            for (k = Math.min(dst.length, x.length) - 1; k >= 0; --k)
              dst[k] = Math.pow(x[k], y);
        }
      };

      DSP.random = function (dst, low, high) {
        if (!low)
          low = 0;
        if (isNaN(parseFloat(high)))
          high = 1;
        var scale = high - low;
        for (var k = dst.length - 1; k >= 0; --k)
          dst[k] = Math.random() * scale + low;
      };

      DSP.round = function (dst, x) {
        for (var k = Math.min(dst.length, x.length) - 1; k >= 0; --k)
          dst[k] = Math.round(x[k]);
      };

      DSP.sin = function (dst, x) {
        for (var k = Math.min(dst.length, x.length) - 1; k >= 0; --k)
          dst[k] = Math.sin(x[k]);
      };

      DSP.sqrt = function (dst, x) {
        for (var k = Math.min(dst.length, x.length) - 1; k >= 0; --k)
          dst[k] = Math.sqrt(x[k]);
      };

      DSP.tan = function (dst, x) {
        for (var k = Math.min(dst.length, x.length) - 1; k >= 0; --k)
          dst[k] = Math.tan(x[k]);
      };

      DSP.clamp = function (dst, x, xMin, xMax) {
        for (var k = Math.min(dst.length, x.length) - 1; k >= 0; --k) {
          var val = x[k];
          dst[k] = val < xMin ? xMin : val > xMax ? xMax : val;
        }
      };

      DSP.fract = function (dst, x) {
        for (var k = Math.min(dst.length, x.length) - 1; k >= 0; --k) {
          var val = x[k];
          dst[k] = val - Math.floor(val);
        }
      };

      DSP.ramp = function (dst, first, last) {
        var maxIdx = dst.length - 1;
        if (maxIdx >= 0)
          dst[0] = first;
        if (maxIdx > 0) {
          var step = (last - first) / maxIdx;
          for (var k = 1; k <= maxIdx; ++k)
            dst[k] = first + step * k;
        }
      };

      DSP.sign = function (dst, x) {
        for (var k = Math.min(dst.length, x.length) - 1; k >= 0; --k)
          dst[k] = x[k] < 0 ? -1 : 1;
      };

      DSP.sum = function (x) {
        var ret = 0;
        for (var k = x.length - 1; k >= 0; --k)
          ret += x[k];
        return ret;
      };

      DSP.sampleLinear = function (dst, x, t, repeat) {
        var xLen = x.length, maxIdx = xLen - 1;
        if (repeat)
          for (var k = Math.min(dst.length, t.length) - 1; k >= 0; --k) {
            var t2 = t[k];
            t2 = t2 - Math.floor(t2/xLen) * xLen;
            var idx = Math.floor(t2);
            var w = t2 - idx;
            var p1 = x[idx];
            var p2 = x[idx < maxIdx ? idx + 1 : 0];
            dst[k] = p1 + w * (p2 - p1);
          }
        else
          for (var k = Math.min(dst.length, t.length) - 1; k >= 0; --k) {
            var t2 = t[k];
            t2 = t2 < 0 ? 0 : t2 > maxIdx ? maxIdx : t2;
            var idx = Math.floor(t2);
            var w = t2 - idx;
            var p1 = x[idx];
            var p2 = x[idx < maxIdx ? idx + 1 : maxIdx];
            dst[k] = p1 + w * (p2 - p1);
          }
      };

      DSP.sampleCubic = function (dst, x, t, repeat) {
        var xLen = x.length, maxIdx = xLen - 1;
        if (repeat)
          for (var k = Math.min(dst.length, t.length) - 1; k >= 0; --k) {
            var t2 = t[k];
            t2 = t2 - Math.floor(t2/xLen) * xLen;
            var idx = Math.floor(t2);
            var w = t2 - idx;
            var w2 = w * w;
            var w3 = w2 * w;
            var h2 = -2*w3 + 3*w2;
            var h1 = 1 - h2;
            var h4 = w3 - w2;
            var h3 = h4 - w2 + w;
            var p1 = x[idx > 0 ? idx - 1 : maxIdx];
            var p2 = x[idx];
            var p3 = x[idx < maxIdx ? idx + 1 : 0];
            var p4 = x[idx < maxIdx - 1 ? idx + 2 : (idx + 2 - Math.floor((idx + 2)/xLen) * xLen)];
            dst[k] = h1 * p2 + h2 * p3 + 0.5 * (h3 * (p3 - p1) + h4 * (p4 - p2));
          }
        else
          for (var k = Math.min(dst.length, t.length) - 1; k >= 0; --k) {
            var t2 = t[k];
            t2 = t2 < 0 ? 0 : t2 > maxIdx ? maxIdx : t2;
            var idx = Math.floor(t2);
            var w = t2 - idx;
            var w2 = w * w;
            var w3 = w2 * w;
            var h2 = -2*w3 + 3*w2;
            var h1 = 1 - h2;
            var h4 = w3 - w2;
            var h3 = h4 - w2 + w;
            var p1 = x[idx > 0 ? idx - 1 :  0];
            var p2 = x[idx];
            var p3 = x[idx < maxIdx ? idx + 1 : maxIdx];
            var p4 = x[idx < maxIdx - 1 ? idx + 2 : maxIdx];
            dst[k] = h1 * p2 + h2 * p3 + 0.5 * (h3 * (p3 - p1) + h4 * (p4 - p2));
          }
      };

      DSP.pack = function (dst, offset, stride, src1, src2, src3, src4) {
        var dstCount = Math.floor((dst.length - offset) / stride);
        var count = Math.min(dstCount, src1.length);
        if (src2)
          if (src3)
            if (src4)
              for (var k = 0; k < count; ++k) {
                dst[offset] = src1[k];
                dst[offset + 1] = src2[k];
                dst[offset + 2] = src3[k];
                dst[offset + 3] = src4[k];
                offset += stride;
              }
            else
              for (var k = 0; k < count; ++k) {
                dst[offset] = src1[k];
                dst[offset + 1] = src2[k];
                dst[offset + 2] = src3[k];
                offset += stride;
              }
          else
            for (var k = 0; k < count; ++k) {
              dst[offset] = src1[k];
              dst[offset + 1] = src2[k];
              offset += stride;
            }
        else
          for (var k = 0; k < count; ++k) {
            dst[offset] = src1[k];
            offset += stride;
          }
      };

      DSP.unpack = function (src, offset, stride, dst1, dst2, dst3, dst4) {
        var srcCount = Math.floor((src.length - offset) / stride);
        var count = Math.min(srcCount, dst1.length);
        if (dst2)
          if (dst3)
            if (dst4)
              for (var k = 0; k < count; ++k) {
                dst1[k] = src[offset];
                dst2[k] = src[offset + 1];
                dst3[k] = src[offset + 2];
                dst4[k] = src[offset + 3];
                offset += stride;
              }
            else
              for (var k = 0; k < count; ++k) {
                dst1[k] = src[offset];
                dst2[k] = src[offset + 1];
                dst3[k] = src[offset + 2];
                offset += stride;
              }
          else
            for (var k = 0; k < count; ++k) {
              dst1[k] = src[offset];
              dst2[k] = src[offset + 1];
              offset += stride;
            }
        else
          for (var k = 0; k < count; ++k) {
            dst1[k] = src[offset];
            offset += stride;
          }
      };

      g.DSP = DSP;
    })();


    //------------------------------------------------------------------------------
    // interface Filter
    //------------------------------------------------------------------------------

    (function () {
      if (g.Filter) return;

      var Filter = function (bSize, aSize) {
        if (isNaN(parseFloat(bSize)) || !isFinite(bSize))
          bSize = 1;
        if (!aSize)
          aSize = 0;
        this.b = new Float32Array(bSize);
        this.b[0] = 1;
        this.a = new Float32Array(aSize);
        this._bHist = new Float32Array(bSize);
        this._aHist = new Float32Array(aSize);
      };

      Filter.prototype.filter = function (dst, x) {
        // Put commonly accessed objects and properties in local variables
        var a = this.a, aLen = a.length,
            b = this.b, bLen = b.length,
            aHist = this._aHist, bHist = this._bHist,
            xLen = x.length, dstLen = dst.length;

        // FIXME: Optimize for long FIR filters

        // Perform run-in part using the history (slow)
        var bHistRunIn = bLen - 1;
        var aHistRunIn = aLen;
        var k;
        for (k = 0; (bHistRunIn || aHistRunIn) && k < xLen; ++k) {
          var m, noHistLen;

          // FIR part
          noHistLen = bLen - bHistRunIn;
          bHistRunIn && bHistRunIn--;
          var res = b[0] * x[k];
          for (m = 1; m < noHistLen; ++m)
            res += b[m] * x[k - m];
          for (; m < bLen; ++m)
            res += b[m] * bHist[m - noHistLen];

          // Recursive part
          noHistLen = aLen - aHistRunIn;
          aHistRunIn && aHistRunIn--;
          for (m = 0; m < noHistLen; ++m)
            res -= a[m] * dst[k - 1 - m];
          for (; m < aLen; ++m)
            res -= a[m] * aHist[m - noHistLen];

          dst[k] = res;
        }

        // Perform history-free part (fast)
        if (bLen == 3 && aLen == 2) {
          // Optimized special case: biquad filter
          var b0 = b[0], b1 = b[1], b2 = b[2], a1 = a[0], a2 = a[1];
          var x0 = x[k-1], x1 = x[k-2], x2;
          var y0 = dst[k-1], y1 = dst[k-2], y2;
          for (; k < xLen; ++k) {
            x2 = x1;
            x1 = x0;
            x0 = x[k];
            y2 = y1;
            y1 = y0;
            y0 = b0 * x0 + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
            dst[k] = y0;
          }
        }
        else {
          // Generic case
          for (; k < xLen; ++k) {
            var m;

            // FIR part
            var res = b[0] * x[k];
            for (m = 1; m < bLen; ++m)
              res += b[m] * x[k - m];

            // Recursive part
            for (m = 0; m < aLen; ++m)
              res -= a[m] * dst[k - 1 - m];

            dst[k] = res;
          }
        }

        // Update history state
        var histCopy = Math.min(bLen - 1, xLen);
        for (k = bLen - 2; k >= histCopy; --k)
          bHist[k] = bHist[k - histCopy];
        for (k = 0; k < histCopy; ++k)
          bHist[k] = x[xLen - 1 - k];
        histCopy = Math.min(aLen, dstLen);
        for (k = aLen - 1; k >= histCopy; --k)
          aHist[k] = aHist[k - histCopy];
        for (k = 0; k < histCopy; ++k)
          aHist[k] = dst[xLen - 1 - k];
      };

      Filter.prototype.clearHistory = function () {
        for (var k = this._bHist.length - 1; k >= 0; --k)
          this._bHist[k] = 0;
        for (var k = this._aHist.length - 1; k >= 0; --k)
          this._aHist[k] = 0;
      };

      g.Filter = Filter;
    })();


    //------------------------------------------------------------------------------
    // interface FFT
    //
    // NOTE: This is essentially a hand-translation of the C language Kiss FFT
    // library, copyright by Mark Borgerding, relicensed with permission from the
    // author.
    //
    // The algorithm implements mixed radix FFT and supports transforms of any size
    // (not just powers of 2). For optimal performance, use sizes that can be
    // factorized into factors 2, 3, 4 and 5.
    //------------------------------------------------------------------------------

    (function () {
      if (g.FFT) return;

      var butterfly2 = function (outRe, outIm, outIdx, stride, twRe, twIm, m) {
        var scratch0Re, scratch0Im,
            out0Re, out0Im, out1Re, out1Im,
            tRe, tIm;

        var tw1 = 0,
            idx0 = outIdx,
            idx1 = outIdx + m;

        var idx0End = idx0 + m;
        while (idx0 < idx0End) {
          // out0 = out[idx0] / 2
          out0Re = outRe[idx0] * 0.5;
          out0Im = outIm[idx0] * 0.5;
          // out1 = out[idx1] / 2
          out1Re = outRe[idx1] * 0.5;
          out1Im = outIm[idx1] * 0.5;

          // scratch0 = out1 * tw[tw1]
          tRe = twRe[tw1]; tIm = twIm[tw1];
          scratch0Re = out1Re * tRe - out1Im * tIm;
          scratch0Im = out1Re * tIm + out1Im * tRe;

          // out[idx1] = out0 - scratch0
          outRe[idx1] = out0Re - scratch0Re;
          outIm[idx1] = out0Im - scratch0Im;

          // out[idx0] = out0 + scratch0
          outRe[idx0] = out0Re + scratch0Re;
          outIm[idx0] = out0Im + scratch0Im;

          tw1 += stride;
          ++idx0; ++idx1;
        }
      };

      var butterfly3 = function (outRe, outIm, outIdx, stride, twRe, twIm, m) {
        var scratch0Re, scratch0Im, scratch1Re, scratch1Im,
            scratch2Re, scratch2Im, scratch3Re, scratch3Im,
            out0Re, out0Im, out1Re, out1Im, out2Re, out2Im,
            tRe, tIm;

        var tw1 = 0,
            tw2 = 0,
            stride2 = 2 * stride,
            idx0 = outIdx,
            idx1 = outIdx + m,
            idx2 = outIdx + 2 * m;

        var epi3Im = twIm[stride*m];

        var div3 = 1 / 3;
        var idx0End = idx0 + m;
        while (idx0 < idx0End) {
          // out0 = out[idx0] / 3
          out0Re = outRe[idx0] * div3;
          out0Im = outIm[idx0] * div3;
          // out1 = out[idx1] / 3
          out1Re = outRe[idx1] * div3;
          out1Im = outIm[idx1] * div3;
          // out2 = out[idx2] / 3
          out2Re = outRe[idx2] * div3;
          out2Im = outIm[idx2] * div3;

          // scratch1 = out1 * tw[tw1]
          tRe = twRe[tw1]; tIm = twIm[tw1];
          scratch1Re = out1Re * tRe - out1Im * tIm;
          scratch1Im = out1Re * tIm + out1Im * tRe;

          // scratch2 = out2 * tw[tw2]
          tRe = twRe[tw2]; tIm = twIm[tw2];
          scratch2Re = out2Re * tRe - out2Im * tIm;
          scratch2Im = out2Re * tIm + out2Im * tRe;

          // scratch3 = scratch1 + scratch2
          scratch3Re = scratch1Re + scratch2Re;
          scratch3Im = scratch1Im + scratch2Im;

          // scratch0 = scratch1 - scratch2
          scratch0Re = scratch1Re - scratch2Re;
          scratch0Im = scratch1Im - scratch2Im;

          // out1 = out0 - scratch3 / 2
          out1Re = out0Re - scratch3Re * 0.5;
          out1Im = out0Im - scratch3Im * 0.5;

          // scratch0 *= epi3.i
          scratch0Re *= epi3Im;
          scratch0Im *= epi3Im;

          // out[idx0] = out0 + scratch3
          outRe[idx0] = out0Re + scratch3Re;
          outIm[idx0] = out0Im + scratch3Im;

          outRe[idx2] = out1Re + scratch0Im;
          outIm[idx2] = out1Im - scratch0Re;

          outRe[idx1] = out1Re - scratch0Im;
          outIm[idx1] = out1Im + scratch0Re;

          tw1 += stride; tw2 += stride2;
          ++idx0; ++idx1; ++idx2;
        }
      };

      var butterfly4 = function (outRe, outIm, outIdx, stride, twRe, twIm, m, inverse) {
        var scratch0Re, scratch0Im, scratch1Re, scratch1Im, scratch2Re, scratch2Im,
            scratch3Re, scratch3Im, scratch4Re, scratch4Im, scratch5Re, scratch5Im,
            out0Re, out0Im, out1Re, out1Im, out2Re, out2Im, out3Re, out3Im,
            tRe, tIm;

        var tw1 = 0,
            tw2 = 0,
            tw3 = 0,
            stride2 = 2 * stride,
            stride3 = 3 * stride,
            idx0 = outIdx,
            idx1 = outIdx + m,
            idx2 = outIdx + 2 * m,
            idx3 = outIdx + 3 * m;

        var div4 = 1 / 4;
        var idx0End = idx0 + m;
        while (idx0 < idx0End) {
          // out0 = out[idx0] / 4
          out0Re = outRe[idx0] * div4;
          out0Im = outIm[idx0] * div4;
          // out1 = out[idx1] / 4
          out1Re = outRe[idx1] * div4;
          out1Im = outIm[idx1] * div4;
          // out2 = out[idx2] / 4
          out2Re = outRe[idx2] * div4;
          out2Im = outIm[idx2] * div4;
          // out3 = out[idx3] / 4
          out3Re = outRe[idx3] * div4;
          out3Im = outIm[idx3] * div4;

          // scratch0 = out1 * tw[tw1]
          tRe = twRe[tw1]; tIm = twIm[tw1];
          scratch0Re = out1Re * tRe - out1Im * tIm;
          scratch0Im = out1Re * tIm + out1Im * tRe;

          // scratch1 = out2 * tw[tw2]
          tRe = twRe[tw2]; tIm = twIm[tw2];
          scratch1Re = out2Re * tRe - out2Im * tIm;
          scratch1Im = out2Re * tIm + out2Im * tRe;

          // scratch2 = out3 * tw[tw3]
          tRe = twRe[tw3]; tIm = twIm[tw3];
          scratch2Re = out3Re * tRe - out3Im * tIm;
          scratch2Im = out3Re * tIm + out3Im * tRe;

          // scratch5 = out0 - scratch1
          scratch5Re = out0Re - scratch1Re;
          scratch5Im = out0Im - scratch1Im;

          // out0 += scratch1
          out0Re += scratch1Re;
          out0Im += scratch1Im;

          // scratch3 = scratch0 + scratch2
          scratch3Re = scratch0Re + scratch2Re;
          scratch3Im = scratch0Im + scratch2Im;

          // scratch4 = scratch0 - scratch2
          scratch4Re = scratch0Re - scratch2Re;
          scratch4Im = scratch0Im - scratch2Im;

          // out[idx2] = out0 - scratch3
          outRe[idx2] = out0Re - scratch3Re;
          outIm[idx2] = out0Im - scratch3Im;

          // out[idx0] = out0 + scratch3
          outRe[idx0] = out0Re + scratch3Re;
          outIm[idx0] = out0Im + scratch3Im;

          if (inverse) {
            outRe[idx1] = scratch5Re - scratch4Im;
            outIm[idx1] = scratch5Im + scratch4Re;
            outRe[idx3] = scratch5Re + scratch4Im;
            outIm[idx3] = scratch5Im - scratch4Re;
          }
          else {
            outRe[idx1] = scratch5Re + scratch4Im;
            outIm[idx1] = scratch5Im - scratch4Re;
            outRe[idx3] = scratch5Re - scratch4Im;
            outIm[idx3] = scratch5Im + scratch4Re;
          }

          tw1 += stride; tw2 += stride2; tw3 += stride3;
          ++idx0; ++idx1; ++idx2; ++idx3;
        }
      };

      var butterfly5 = function (outRe, outIm, outIdx, stride, twRe, twIm, m) {
        var scratch0Re, scratch0Im, scratch1Re, scratch1Im, scratch2Re, scratch2Im,
            scratch3Re, scratch3Im, scratch4Re, scratch4Im, scratch5Re, scratch5Im,
            scratch6Re, scratch6Im, scratch7Re, scratch7Im, scratch8Re, scratch8Im,
            scratch9Re, scratch9Im, scratch10Re, scratch10Im, scratch11Re, scratch11Im,
            scratch12Re, scratch12Im,
            out0Re, out0Im, out1Re, out1Im, out2Re, out2Im, out3Re, out3Im, out4Re, out4Im,
            tRe, tIm;

        var tw1 = 0,
            tw2 = 0,
            tw3 = 0,
            tw4 = 0,
            stride2 = 2 * stride,
            stride3 = 3 * stride,
            stride4 = 4 * stride;

        var idx0 = outIdx,
            idx1 = outIdx + m,
            idx2 = outIdx + 2 * m,
            idx3 = outIdx + 3 * m,
            idx4 = outIdx + 4 * m;

        // ya = tw[stride*m];
        var yaRe = twRe[stride * m],
            yaIm = twIm[stride * m];
        // yb = tw[stride*2*m];
        var ybRe = twRe[stride * 2 * m],
            ybIm = twIm[stride * 2 * m];

        var div5 = 1 / 5;
        var idx0End = idx0 + m;
        while (idx0 < idx0End) {
          // out0 = out[idx0] / 5
          out0Re = outRe[idx0] * div5;
          out0Im = outIm[idx0] * div5;
          // out1 = out[idx1] / 5
          out1Re = outRe[idx1] * div5;
          out1Im = outIm[idx1] * div5;
          // out2 = out[idx2] / 5
          out2Re = outRe[idx2] * div5;
          out2Im = outIm[idx2] * div5;
          // out3 = out[idx3] / 5
          out3Re = outRe[idx3] * div5;
          out3Im = outIm[idx3] * div5;
          // out4 = out[idx4] / 5
          out4Re = outRe[idx4] * div5;
          out4Im = outIm[idx4] * div5;

          // scratch0 = out0;
          scratch0Re = out0Re;
          scratch0Im = out0Im;

          // scratch1 = out1 * tw[tw1]
          tRe = twRe[tw1]; tIm = twIm[tw1];
          scratch1Re = out1Re * tRe - out1Im * tIm;
          scratch1Im = out1Re * tIm + out1Im * tRe;
          // scratch2 = out2 * tw[tw2]
          tRe = twRe[tw2]; tIm = twIm[tw2];
          scratch2Re = out2Re * tRe - out2Im * tIm;
          scratch2Im = out2Re * tIm + out2Im * tRe;
          // scratch3 = out3 * tw[tw3]
          tRe = twRe[tw3]; tIm = twIm[tw3];
          scratch3Re = out3Re * tRe - out3Im * tIm;
          scratch3Im = out3Re * tIm + out3Im * tRe;
          // scratch4 = out4 * tw[tw4]
          tRe = twRe[tw4]; tIm = twIm[tw4];
          scratch4Re = out4Re * tRe - out4Im * tIm;
          scratch4Im = out4Re * tIm + out4Im * tRe;

          // scratch7 = scratch1 + scratch4
          scratch7Re = scratch1Re + scratch4Re;
          scratch7Im = scratch1Im + scratch4Im;
          // scratch10 = scratch1 - scratch4
          scratch10Re = scratch1Re - scratch4Re;
          scratch10Im = scratch1Im - scratch4Im;
          // scratch8 = scratch2 + scratch2
          scratch8Re = scratch2Re + scratch3Re;
          scratch8Im = scratch2Im + scratch3Im;
          // scratch9 = scratch2 - scratch3
          scratch9Re = scratch2Re - scratch3Re;
          scratch9Im = scratch2Im - scratch3Im;

          // out[idx0] = out0 + scratch7 + scratch8
          outRe[idx0] = out0Re + scratch7Re + scratch8Re;
          outIm[idx0] = out0Im + scratch7Im + scratch8Im;

          scratch5Re = scratch0Re + scratch7Re * yaRe + scratch8Re * ybRe;
          scratch5Im = scratch0Im + scratch7Im * yaRe + scratch8Im * ybRe;

          scratch6Re = scratch10Im * yaIm + scratch9Im * ybIm;
          scratch6Im = -scratch10Re * yaIm - scratch9Re * ybIm;

          // out[idx1] = scratch5 - scratch6
          outRe[idx1] = scratch5Re - scratch6Re;
          outIm[idx1] = scratch5Im - scratch6Im;
          // out[idx4] = scratch5 + scratch6
          outRe[idx4] = scratch5Re + scratch6Re;
          outIm[idx4] = scratch5Im + scratch6Im;

          scratch11Re = scratch0Re + scratch7Re * ybRe + scratch8Re * yaRe;
          scratch11Im = scratch0Im + scratch7Im * ybRe + scratch8Im * yaRe;

          scratch12Re = -scratch10Im * ybIm + scratch9Im * yaIm;
          scratch12Im = scratch10Re * ybIm - scratch9Re * yaIm;

          // out[idx2] = scratch11 + scratch12
          outRe[idx2] = scratch11Re + scratch12Re;
          outIm[idx2] = scratch11Im + scratch12Im;
          // out[idx3] = scratch11 - scratch12
          outRe[idx3] = scratch11Re - scratch12Re;
          outIm[idx3] = scratch11Im - scratch12Im;

          tw1 += stride; tw2 += stride2; tw3 += stride3; tw4 += stride4;
          ++idx0; ++idx1; ++idx2; ++idx3; ++idx4;
        }
      };

      var butterflyN = function (outRe, outIm, outIdx, stride, twRe, twIm, m, p, size) {
        var u, q1, q, idx0;
        var out0Re, out0Im, aRe, aIm, tRe, tIm;

        // FIXME: Allocate statically
        var scratchRe = new Float32Array(p);
        var scratchIm = new Float32Array(p);

        var pInv = 1 / p;
        for (u = 0; u < m; ++u) {
          idx0 = outIdx + u;
          for (q1 = 0; q1 < p; ++q1) {
            // scratch[q1] = out[idx0] / p
            scratchRe[q1] = outRe[idx0] * pInv;
            scratchIm[q1] = outIm[idx0] * pInv;
            idx0 += m;
          }

          idx0 = outIdx + u;
          var tw1Incr = stride * u;
          for (q1 = 0; q1 < p; ++q1) {
            // out0 = scratch[0]
            out0Re = scratchRe[0];
            out0Im = scratchIm[0];

            var tw1 = 0;
            for (q = 1; q < p; ++q) {
              tw1 += tw1Incr;
              if (tw1 >= size)
                tw1 -= size;

              // out0 += scratch[q] * tw[tw1]
              aRe = scratchRe[q], aIm = scratchIm[q];
              tRe = twRe[tw1], tIm = twIm[tw1];
              out0Re += aRe * tRe - aIm * tIm;
              out0Im += aRe * tIm + aIm * tRe;
            }

            // out[idx0] = out0
            outRe[idx0] = out0Re;
            outIm[idx0] = out0Im;

            idx0 += m;
            tw1Incr += stride;
          }
        }
      };

      var work = function (outRe, outIm, outIdx, fRe, fIm, fIdx, stride, inStride, factors, factorsIdx, twRe, twIm, size, inverse) {
        var p = factors[factorsIdx++];  // Radix
        var m = factors[factorsIdx++];  // Stage's FFT length / p

        var outIdxBeg = outIdx;
        var outIdxEnd = outIdx + p * m;

        var fIdxIncr = stride * inStride;
        if (m == 1) {
          do {
            outRe[outIdx] = fRe[fIdx];
            outIm[outIdx] = fIm[fIdx];
            fIdx += fIdxIncr;
            ++outIdx;
          }
          while (outIdx != outIdxEnd);
        }
        else {
          do {
            // DFT of size m*p performed by doing p instances of smaller DFTs of
            // size m, each one takes a decimated version of the input.
            work(outRe, outIm, outIdx, fRe, fIm, fIdx, stride * p, inStride, factors, factorsIdx, twRe, twIm, size, inverse);
            fIdx += fIdxIncr;
            outIdx += m;
          }
          while (outIdx != outIdxEnd);
        }

        outIdx = outIdxBeg;

        // Recombine the p smaller DFTs
        switch (p) {
          case 2:  butterfly2(outRe, outIm, outIdx, stride, twRe, twIm, m); break;
          case 3:  butterfly3(outRe, outIm, outIdx, stride, twRe, twIm, m); break;
          case 4:  butterfly4(outRe, outIm, outIdx, stride, twRe, twIm, m, inverse); break;
          case 5:  butterfly5(outRe, outIm, outIdx, stride, twRe, twIm, m); break;
          default: butterflyN(outRe, outIm, outIdx, stride, twRe, twIm, m, p, size); break;
        }
      };

      /*  facBuf is populated by p1,m1,p2,m2, ...
          where
          p[i] * m[i] = m[i-1]
          m0 = n                  */
      var factor = function (n, facBuf) {
        // Factor out powers of 4, powers of 2, then any remaining primes
        var p = 4;
        var floorSqrt = Math.floor(Math.sqrt(n));
        var idx = 0;
        do {
          while (n % p) {
            switch (p) {
              case 4:  p = 2; break;
              case 2:  p = 3; break;
              default: p += 2; break;
            }
            if (p > floorSqrt)
              p = n;
          }
          n = Math.floor(n / p);
          facBuf[idx++] = p;
          facBuf[idx++] = n;
        }
        while (n > 1);
      };

      var FFT = function (size) {
        if (!size)
          size = 256;
        this.size = size;

        // Allocate arrays for twiddle factors
        this._twiddlesFwdRe = new Float32Array(size);
        this._twiddlesFwdIm = new Float32Array(size);
        this._twiddlesInvRe = this._twiddlesFwdRe;
        this._twiddlesInvIm = new Float32Array(size);

        // Init twiddle factors (both forward & reverse)
        for (var i = 0; i < size; ++i) {
            var phase = -2*Math.PI*i / size;
            var cosPhase = Math.cos(phase), sinPhase = Math.sin(phase);
            this._twiddlesFwdRe[i] = cosPhase;
            this._twiddlesFwdIm[i] = sinPhase;
            this._twiddlesInvIm[i] = -sinPhase;
        }

        // Allocate arrays for radix plan
        this._factors = new Int32Array(2 * 32);  // MAXFACTORS = 32

        // Init radix factors (mixed radix breakdown)
        factor(size, this._factors);
      };

      FFT.prototype.forwardCplx = function (dstReal, dstImag, xReal, xImag) {
        var twRe = this._twiddlesFwdRe;
        var twIm = this._twiddlesFwdIm;
        work(dstReal, dstImag, 0, xReal, xImag, 0, 1, 1, this._factors, 0, twRe, twIm, this.size, false);
      };

      FFT.prototype.forward = function (dstReal, dstImag, x) {
        // FIXME: Optimize this case (real input signal)
        this.forwardCplx(dstReal, dstImag, x, new Float32Array(this.size));
      };

      FFT.prototype.inverseCplx = function (dstReal, dstImag, xReal, xImag) {
        var twRe = this._twiddlesInvRe;
        var twIm = this._twiddlesInvIm;
        work(dstReal, dstImag, 0, xReal, xImag, 0, 1, 1, this._factors, 0, twRe, twIm, this.size, true);
      };

      FFT.prototype.inverse = function (dst, xReal, xImag) {
        // FIXME: Optimize this case (real output signal)
        this.inverseCplx(dst, new Float32Array(this.size), xReal, xImag);
      };

      g.FFT = FFT;
    })();

    
})();
;
/** Random.js library.
 * 
 * The code is licensed as LGPL.
*/

/* 
   A C-program for MT19937, with initialization improved 2002/1/26.
   Coded by Takuji Nishimura and Makoto Matsumoto.
 
   Before using, initialize the state by using init_genrand(seed)  
   or init_by_array(init_key, key_length).
 
   Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
   All rights reserved.                          
 
   Redistribution and use in source and binary forms, with or without
   modification, are permitted provided that the following conditions
   are met:

     1. Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.

     2. Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.

     3. The names of its contributors may not be used to endorse or promote 
        products derived from this software without specific prior written 
        permission.

   THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
   LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
   A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
   CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
   EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
   PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
   PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
   LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
   NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


   Any feedback is very welcome.
   http://www.math.sci.hiroshima-u.ac.jp/~m-mat/MT/emt.html
   email: m-mat @ math.sci.hiroshima-u.ac.jp (remove space)
 */

var Random = function(seed) {
	seed = (seed === undefined) ? (new Date()).getTime() : seed;
	if (typeof(seed) !== 'number'                             // ARG_CHECK
		|| Math.ceil(seed) != Math.floor(seed)) {             // ARG_CHECK
		throw new TypeError("seed value must be an integer"); // ARG_CHECK
	}                                                         // ARG_CHECK
	
	
	/* Period parameters */  
	this.N = 624;
	this.M = 397;
	this.MATRIX_A = 0x9908b0df;   /* constant vector a */
	this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
	this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

	this.mt = new Array(this.N); /* the array for the state vector */
	this.mti=this.N+1; /* mti==N+1 means mt[N] is not initialized */

	//this.init_genrand(seed);
	this.init_by_array([seed], 1);
};

/* initializes mt[N] with a seed */
Random.prototype.init_genrand = function(s) {
	this.mt[0] = s >>> 0;
	for (this.mti=1; this.mti<this.N; this.mti++) {
		var s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
		this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
		+ this.mti;
		/* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
		/* In the previous versions, MSBs of the seed affect   */
		/* only MSBs of the array mt[].                        */
		/* 2002/01/09 modified by Makoto Matsumoto             */
		this.mt[this.mti] >>>= 0;
		/* for >32 bit machines */
	}
};

/* initialize by an array with array-length */
/* init_key is the array for initializing keys */
/* key_length is its length */
/* slight change for C++, 2004/2/26 */
Random.prototype.init_by_array = function(init_key, key_length) {
	var i, j, k;
	this.init_genrand(19650218);
	i=1; j=0;
	k = (this.N>key_length ? this.N : key_length);
	for (; k; k--) {
		var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
		this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
		+ init_key[j] + j; /* non linear */
		this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
		i++; j++;
		if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
		if (j>=key_length) j=0;
	}
	for (k=this.N-1; k; k--) {
		var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
		this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
		- i; /* non linear */
		this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
		i++;
		if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
	}

	this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */ 
};
 
/* generates a random number on [0,0xffffffff]-interval */
Random.prototype.genrand_int32 = function() {
	var y;
	var mag01 = new Array(0x0, this.MATRIX_A);
	/* mag01[x] = x * MATRIX_A  for x=0,1 */

	if (this.mti >= this.N) { /* generate N words at one time */
		var kk;

		if (this.mti == this.N+1)   /* if init_genrand() has not been called, */
			this.init_genrand(5489); /* a default initial seed is used */

		for (kk=0;kk<this.N-this.M;kk++) {
			y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
			this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
		}
		for (;kk<this.N-1;kk++) {
			y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
			this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
		}
		y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
		this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

		this.mti = 0;
	}

	y = this.mt[this.mti++];

	/* Tempering */
	y ^= (y >>> 11);
	y ^= (y << 7) & 0x9d2c5680;
	y ^= (y << 15) & 0xefc60000;
	y ^= (y >>> 18);

	return y >>> 0;
};
 
/* generates a random number on [0,0x7fffffff]-interval */
Random.prototype.genrand_int31 = function() {
	return (this.genrand_int32()>>>1);
};

/* generates a random number on [0,1]-real-interval */
Random.prototype.genrand_real1 = function() {
	return this.genrand_int32()*(1.0/4294967295.0); 
	/* divided by 2^32-1 */ 
};

/* generates a random number on [0,1)-real-interval */
Random.prototype.random = function() {
	if (this.pythonCompatibility) {
		if (this.skip) {
			this.genrand_int32();
		}
		this.skip = true;
	}
	return this.genrand_int32()*(1.0/4294967296.0); 
	/* divided by 2^32 */
};

/* generates a random number on (0,1)-real-interval */
Random.prototype.genrand_real3 = function() {
	return (this.genrand_int32() + 0.5)*(1.0/4294967296.0); 
	/* divided by 2^32 */
};

/* generates a random number on [0,1) with 53-bit resolution*/
Random.prototype.genrand_res53 = function() { 
	var a=this.genrand_int32()>>>5, b=this.genrand_int32()>>>6; 
	return(a*67108864.0+b)*(1.0/9007199254740992.0); 
};

/* These real versions are due to Isaku Wada, 2002/01/09 added */


/**************************************************************************/
Random.prototype.LOG4 = Math.log(4.0);
Random.prototype.SG_MAGICCONST = 1.0 + Math.log(4.5);

Random.prototype.exponential = function (lambda) {
	if (arguments.length != 1) {                         // ARG_CHECK                     
		throw new SyntaxError("exponential() must "     // ARG_CHECK
				+ " be called with 'lambda' parameter"); // ARG_CHECK
	}                                                   // ARG_CHECK
	
	var r = this.random();
	return -Math.log(r) / lambda;
};

Random.prototype.gamma = function (alpha, beta) {
	if (arguments.length != 2) {                         // ARG_CHECK                     
		throw new SyntaxError("gamma() must be called"  // ARG_CHECK
				+ " with alpha and beta parameters"); // ARG_CHECK
	}                                                   // ARG_CHECK
	
	/* Based on Python 2.6 source code of random.py.
	 */
	
	if (alpha > 1.0) {
		var ainv = Math.sqrt(2.0 * alpha - 1.0);
		var bbb = alpha - this.LOG4;
		var ccc = alpha + ainv;
		
		while (true) {
			var u1 = this.random();
			if ((u1 < 1e-7) || (u > 0.9999999)) {
				continue;
			}
			var u2 = 1.0 - this.random();
			var v = Math.log(u1 / (1.0 - u1)) / ainv;
			var x = alpha * Math.exp(v);
			var z = u1 * u1 * u2;
			var r = bbb + ccc * v - x;
			if ((r + this.SG_MAGICCONST - 4.5 * z >= 0.0) || (r >= Math.log(z))) {
				return x * beta;
			}
		}
	} else if (alpha == 1.0) {
		var u = this.random();
		while (u <= 1e-7) {
			u = this.random();
		}
		return - Math.log(u) * beta;
	} else {
		while (true) {
			var u = this.random();
			var b = (Math.E + alpha) / Math.E;
			var p = b * u;
			if (p <= 1.0) {
				var x = Math.pow(p, 1.0 / alpha);
			} else {
				var x = - Math.log((b - p) / alpha);
			}
			var u1 = this.random();
			if (p > 1.0) {
				if (u1 <= Math.pow(x, (alpha - 1.0))) {
					break;
				}
			} else if (u1 <= Math.exp(-x)) {
				break;
			}
		}
		return x * beta;
	}
	
};

Random.prototype.normal = function (mu, sigma) {
	if (arguments.length != 2) {                          // ARG_CHECK                     
		throw new SyntaxError("normal() must be called"  // ARG_CHECK
				+ " with mu and sigma parameters");      // ARG_CHECK
	}                                                    // ARG_CHECK
	
	var z = this.lastNormal;
	this.lastNormal = NaN;
	if (!z) {
		var a = this.random() * 2 * Math.PI;
		var b = Math.sqrt(-2.0 * Math.log(1.0 - this.random()));
		z = Math.cos(a) * b;
		this.lastNormal = Math.sin(a) * b;
	} 
	return mu + z * sigma;
};

Random.prototype.pareto = function (alpha) {
	if (arguments.length != 1) {                         // ARG_CHECK                     
		throw new SyntaxError("pareto() must be called" // ARG_CHECK
				+ " with alpha parameter");             // ARG_CHECK
	}                                                   // ARG_CHECK
	
	var u = this.random();
	return 1.0 / Math.pow((1 - u), 1.0 / alpha);
};

Random.prototype.triangular = function (lower, upper, mode) {
	// http://en.wikipedia.org/wiki/Triangular_distribution
	if (arguments.length != 3) {                         // ARG_CHECK                     
		throw new SyntaxError("triangular() must be called" // ARG_CHECK
		+ " with lower, upper and mode parameters");    // ARG_CHECK
	}                                                   // ARG_CHECK
	
	var c = (mode - lower) / (upper - lower);
	var u = this.random();
	
	if (u <= c) {
		return lower + Math.sqrt(u * (upper - lower) * (mode - lower));
	} else {
		return upper - Math.sqrt((1 - u) * (upper - lower) * (upper - mode));
	}
};

Random.prototype.uniform = function (lower, upper) {
	if (arguments.length != 2) {                         // ARG_CHECK                     
		throw new SyntaxError("uniform() must be called" // ARG_CHECK
		+ " with lower and upper parameters");    // ARG_CHECK
	}                                                   // ARG_CHECK
	return lower + this.random() * (upper - lower);
};

Random.prototype.weibull = function (alpha, beta) {
	if (arguments.length != 2) {                         // ARG_CHECK                     
		throw new SyntaxError("weibull() must be called" // ARG_CHECK
		+ " with alpha and beta parameters");    // ARG_CHECK
	}                                                   // ARG_CHECK
	var u = 1.0 - this.random();
	return alpha * Math.pow(-Math.log(u), 1.0 / beta);
};
;/*! Flocking 0.1, Copyright 2011-2014 Colin Clark | flockingjs.org */

/*
* Flocking - Creative audio synthesis for the Web!
* http://github.com/colinbdclark/flocking
*
* Copyright 2011-2014, Colin Clark
* Dual licensed under the MIT and GPL Version 2 licenses.
*/

/*global require, Float32Array, window, AudioContext, webkitAudioContext*/
/*jshint white: false, newcap: true, regexp: true, browser: true,
    forin: false, nomen: true, bitwise: false, maxerr: 100,
    indent: 4, plusplus: false, curly: true, eqeqeq: true,
    freeze: true, latedef: true, noarg: true, nonew: true, quotmark: double, undef: true,
    unused: true, strict: true, asi: false, boss: false, evil: false, expr: false,
    funcscope: false*/

var fluid = fluid || require("infusion"),
    flock = fluid.registerNamespace("flock");

(function () {
    "use strict";

    var $ = fluid.registerNamespace("jQuery");

    flock.init = function (options) {
        var enviroOpts = !options ? undefined : {
            audioSettings: options
        };
        flock.enviro.shared = flock.enviro(enviroOpts);
    };

    flock.OUT_UGEN_ID = "flocking-out";
    flock.PI = Math.PI;
    flock.TWOPI = 2.0 * Math.PI;
    flock.HALFPI = Math.PI / 2.0;
    flock.LOG01 = Math.log(0.1);
    flock.LOG001 = Math.log(0.001);
    flock.ROOT2 = Math.sqrt(2);

    flock.rates = {
        AUDIO: "audio",
        CONTROL: "control",
        SCHEDULED: "scheduled",
        DEMAND: "demand",
        CONSTANT: "constant"
    };

    flock.sampleFormats = {
        FLOAT32NE: "float32NE"
    };

    flock.browser = function () {
        if (typeof navigator === "undefined") {
            return {};
        }

        // This is a modified version of jQuery's browser detection code,
        // which they removed from jQuery 2.0.
        // Some of us still have to live in the messy reality of the web.
        var ua = navigator.userAgent.toLowerCase(),
            browser = {},
            match,
            matched;

        match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];

        matched = {
            browser: match[1] || "",
            version: match[2] || "0"
        };

        if (matched.browser) {
            browser[matched.browser] = true;
            browser.version = matched.version;
        }

        // Chrome is Webkit, but Webkit is also Safari.
        if (browser.chrome) {
            browser.webkit = true;
        } else if (browser.webkit) {
            browser.safari = true;
        }

        return browser;
    };

    // TODO: Move to components in the static environment and into the appropriate platform files.
    fluid.registerNamespace("flock.platform");
    flock.platform.isBrowser = typeof window !== "undefined";
    flock.platform.hasRequire = typeof require !== "undefined";
    flock.platform.os = flock.platform.isBrowser ? window.navigator.platform : fluid.require("os").platform();
    flock.platform.isLinux = flock.platform.os.indexOf("Linux") > -1;
    flock.platform.isAndroid = flock.platform.isLinux && flock.platform.os.indexOf("arm") > -1;
    flock.platform.isIOS = flock.platform.os === "iPhone" || flock.platform.os === "iPad" || flock.platform.os === "iPod";
    flock.platform.isMobile = flock.platform.isAndroid || flock.platform.isIOS;
    flock.platform.browser = flock.browser();
    flock.platform.isWebAudio = typeof AudioContext !== "undefined" || typeof webkitAudioContext !== "undefined";
    flock.platform.audioEngine = flock.platform.isBrowser ? (flock.platform.isWebAudio ? "webAudio" : "moz") : "nodejs";
    fluid.staticEnvironment.audioEngine = fluid.typeTag("flock.platform." + flock.platform.audioEngine);

    flock.defaultBufferSizeForPlatform = function () {
        if (flock.platform.browser.mozilla) {
            // Strangely terrible performance seems to have cropped up on Firefox in recent versions.
            return 16384;
        }

        if (flock.platform.isMobile) {
            return 8192;
        }

        return 1024;
    };

    flock.shim = {
        URL: flock.platform.isBrowser ? (window.URL || window.webkitURL || window.msURL) : undefined
    };

    flock.requireModule = function (globalName, moduleName) {
        if (!moduleName) {
            moduleName = globalName;
        }
        return flock.platform.isBrowser ? window[globalName] :
            (flock.platform.hasRequire ? require(moduleName)[globalName] : undefined);
    };

    /*************
     * Utilities *
     *************/

    flock.isIterable = function (o) {
        var type = typeof o;
        return o && o.length !== undefined && type !== "string" && type !== "function";
    };

    flock.hasTag = function (obj, tag) {
        if (!obj || !tag) {
            return false;
        }
        return obj.tags && obj.tags.indexOf(tag) > -1;
    };

    flock.generate = function (bufOrSize, generator) {
        var buf = typeof bufOrSize === "number" ? new Float32Array(bufOrSize) : bufOrSize,
            isFunc = typeof generator === "function",
            i;

        for (i = 0; i < buf.length; i++) {
            buf[i] = isFunc ? generator(i, buf) : generator;
        }

        return buf;
    };

    flock.generate.silence = function (bufOrSize) {
        if (typeof bufOrSize === "number") {
            return new Float32Array(bufOrSize);
        }

        var buf = bufOrSize,
            i;
        for (i = 0; i < buf.length; i++) {
            buf[i] = 0.0;
        }
        return buf;
    };

    /**
     * Randomly selects an index from the specified array.
     */
    flock.randomIndex = function (arr) {
        var max = arr.length - 1;
        return Math.round(Math.random() * max);
    };

    /**
     * Randomly selects an item from an array-like object.
     *
     * @param {Array-like object} arr the array to choose from
     * @param {Function} a selection strategy; defaults to flock.randomIndex
     * @return a randomly selected list item
     */
    flock.arrayChoose = function (arr, strategy) {
        strategy = strategy || flock.randomIndex;
        arr = fluid.makeArray(arr);
        var idx = strategy(arr);
        return arr[idx];
    };

    /**
     * Randomly selects an item from an array or object.
     *
     * @param {Array-like object|Object} collection the object to choose from
     * @return a randomly selected item from collection
     */
    flock.choose = function (collection, strategy) {
        var key, val;

        if (flock.isIterable(collection)) {
            val = flock.arrayChoose(collection, strategy);
            return val;
        }

        key = flock.arrayChoose(collection.keys, strategy);
        val = collection[key];
        return val;
    };

    /**
     * Normalizes the specified buffer in place to the specified value.
     *
     * @param {Arrayable} buffer the buffer to normalize
     * @param {Number} normal the value to normalize the buffer to
     * @param {Arrayable} a buffer to output values into; if omitted, buffer will be modified in place
     * @return the buffer, normalized in place
     */
    flock.normalize = function (buffer, normal, output) {
        output = output || buffer;

        var maxVal = 0.0,
            i,
            current,
            val;

        normal = normal === undefined ? 1.0 : normal;
        // Find the maximum value in the buffer.
        for (i = 0; i < buffer.length; i++) {
            current = Math.abs(buffer[i]);
            if (current > maxVal) {
                maxVal = current;
            }
        }

        // And then normalize the buffer in place.
        if (maxVal > 0.0) {
            for (i = 0; i < buffer.length; i++) {
                val = buffer[i];
                output[i] = (val / maxVal) * normal;
            }
        }

        return output;
    };

    flock.generateFourierTable = function (size, scale, numHarms, phase, amps) {
        phase *= flock.TWOPI;

        return flock.generate(size, function (i) {
            var harm,
                amp,
                w,
                val = 0.0;

            for (harm = 0; harm < numHarms; harm++) {
                amp = amps ? amps[harm] : 1.0;
                w = (harm + 1) * (i * scale);
                val += amp * Math.cos(w + phase);
            }

            return val;
        });
    };

    flock.generateNormalizedFourierTable = function (size, scale, numHarms, phase, ampGenFn) {
        var amps = flock.generate(numHarms, function (harm) {
            return ampGenFn(harm + 1); //  Harmonics are indexed from 1 instead of 0.
        });

        var table = flock.generateFourierTable(size, scale, numHarms, phase, amps);
        return flock.normalize(table);
    };

    flock.fillTable = function (sizeOrTable, fillFn) {
        var len = typeof (sizeOrTable) === "number" ? sizeOrTable : sizeOrTable.length;
        return fillFn(sizeOrTable, flock.TWOPI / len);
    };

    flock.tableGenerators = {
        sin: function (size, scale) {
            return flock.generate(size, function (i) {
                return Math.sin(i * scale);
            });
        },

        tri: function (size, scale) {
            return flock.generateNormalizedFourierTable(size, scale, 1000, 1.0, function (harm) {
                // Only odd harmonics,
                // amplitudes decreasing by the inverse square of the harmonic number
                return harm % 2 === 0 ? 0.0 : 1.0 / (harm * harm);
            });
        },

        saw: function (size, scale) {
            return flock.generateNormalizedFourierTable(size, scale, 10, -0.25, function (harm) {
                // All harmonics,
                // amplitudes decreasing by the inverse of the harmonic number
                return 1.0 / harm;
            });
        },

        square: function (size, scale) {
            return flock.generateNormalizedFourierTable(size, scale, 10, -0.25, function (harm) {
                // Only odd harmonics,
                // amplitudes decreasing by the inverse of the harmonic number
                return harm % 2 === 0 ? 0.0 : 1.0 / harm;
            });
        }
    };

    flock.range = function (buf) {
        var range = {
            max: Number.NEGATIVE_INFINITY,
            min: Infinity
        };
        var i, val;

        for (i = 0; i < buf.length; i++) {
            val = buf[i];
            if (val > range.max) {
                range.max = val;
            }
            if (val < range.min) {
                range.min = val;
            }
        }

        return range;
    };

    flock.scale = function (buf) {
        if (!buf) {
            return;
        }

        var range = flock.range(buf),
            mul = (range.max - range.min) / 2,
            sub = (range.max + range.min) / 2,
            i;

        for (i = 0; i < buf.length; i++) {
            buf[i] = (buf[i] - sub) / mul;
        }

        return buf;
    };

    flock.copyBuffer = function (buffer, start, end) {
        if (end === undefined) {
            end = buffer.length;
        }

        var len = end - start,
            target = new Float32Array(len),
            i,
            j;

        for (i = start, j = 0; i < end; i++, j++) {
            target[j] = buffer[i];
        }

        return target;
    };

    flock.parseMidiString = function (midiStr) {
        if (!midiStr || midiStr.length < 2) {
            return NaN;
        }

        midiStr = midiStr.toLowerCase();

        var secondChar = midiStr.charAt(1),
            splitIdx = secondChar === "#" || secondChar === "b" ? 2 : 1,
            note = midiStr.substring(0, splitIdx),
            octave = Number(midiStr.substring(splitIdx)),
            pitchClass = flock.midiFreq.noteNames[note],
            midiNum = octave * 12 + pitchClass;

        return midiNum;
    };

    flock.midiFreq = function (midi, a4Freq, a4NoteNum, notesPerOctave) {
        a4Freq = a4Freq === undefined ? 440 : a4Freq;
        a4NoteNum = a4NoteNum === undefined ? 69 : a4NoteNum;
        notesPerOctave = notesPerOctave || 12;

        if (typeof midi === "string") {
            midi = flock.parseMidiString(midi);
        }

        return a4Freq * Math.pow(2, (midi - a4NoteNum) * 1 / notesPerOctave);
    };

    flock.midiFreq.noteNames = {
        "b#": 0,
        "c": 0,
        "c#": 1,
        "db": 1,
        "d": 2,
        "d#": 3,
        "eb": 3,
        "e": 4,
        "e#": 5,
        "f": 5,
        "f#": 6,
        "gb": 6,
        "g": 7,
        "g#": 8,
        "ab": 8,
        "a": 9,
        "a#": 10,
        "bb": 10,
        "b": 11,
        "cb": 11
    };

    flock.interpolate = {};

    /**
     * Performs linear interpretation.
     */
    flock.interpolate.linear = function (idx, table) {
        idx = idx % table.length;

        var i1 = idx | 0,
            i2 = (i1 + 1) % table.length,
            frac = idx - i1,
            y1 = table[i1],
            y2 = table[i2];

        return y1 + frac * (y2 - y1);
    };

    /**
     * Performs cubic interpretation.
     *
     * Based on Laurent De Soras' implementation at:
     * http://www.musicdsp.org/showArchiveComment.php?ArchiveID=93
     *
     * @param idx {Number} an index into the table
     * @param table {Arrayable} the table from which values around idx should be drawn and interpolated
     * @return {Number} an interpolated value
     */
    flock.interpolate.cubic = function (idx, table) {
        var len = table.length,
            intPortion = Math.floor(idx),
            i0 = intPortion % len,
            frac = idx - intPortion,
            im1 = i0 > 0 ? i0 - 1 : len - 1,
            i1 = (i0 + 1) % len,
            i2 = (i0 + 2) % len,
            xm1 = table[im1],
            x0 = table[i0],
            x1 = table[i1],
            x2 = table[i2],
            c = (x1 - xm1) * 0.5,
            v = x0 - x1,
            w = c + v,
            a = w + v + (x2 - x0) * 0.5,
            bNeg = w + a,
            val = (((a * frac) - bNeg) * frac + c) * frac + x0;

        return val;
    };


    flock.expand = {};

    // TODO: Unit tests.
    flock.expand.overlay = function (expandSpec) {
        if (!expandSpec) {
            return;
        }

        var ugenDefs = [];

        for (var inputPath in expandSpec.expandInputs) {
            var expansions = expandSpec.expandInputs[inputPath];
            if (expansions.length > ugenDefs.length) {
                flock.expand.overlay.extend(ugenDefs, expandSpec.ugenDef, expansions.length);
            }

            flock.expand.overlay.merge(ugenDefs, inputPath, expansions);
        }

        return ugenDefs;
    };

    flock.expand.overlay.extend = function (arr, protoObj, length) {
        var numExtra = length - arr.length;

        for (var i = 0; i < numExtra; i++) {
            arr.push(fluid.copy(protoObj));
        }

        return arr;
    };

    flock.expand.overlay.merge = function (protos, path, extensions) {
        for (var i = 0; i < extensions.length; i++) {
            var obj = protos[i],
                extension = extensions[i];
            flock.set(obj, path, extension);
        }

        return protos;
    };

    flock.pathParseError = function (root, path, token) {
        throw new Error("Error parsing path: " + path + ". Segment '" + token +
            "' could not be resolved. Root object was: " + fluid.prettyPrintJSON(root));
    };

    flock.get = function (root, path) {
        if (!root) {
            return fluid.getGlobalValue(path);
        }

        if (arguments.length === 1 && typeof root === "string") {
            return fluid.getGlobalValue(root);
        }

        if (!path || path === "") {
            return;
        }

        var tokenized = path === "" ? [] : String(path).split("."),
            valForSeg = root[tokenized[0]],
            i;

        for (i = 1; i < tokenized.length; i++) {
            if (valForSeg === null || valForSeg === undefined) {
                flock.pathParseError(root, path, tokenized[i - 1]);
            }
            valForSeg = valForSeg[tokenized[i]];
        }
        return valForSeg;
    };

    flock.set = function (root, path, value) {
        if (!root || !path || path === "") {
            return;
        }

        var tokenized = String(path).split("."),
            l = tokenized.length,
            prop = tokenized[0],
            i,
            type;

        for (i = 1; i < l; i++) {
            root = root[prop];
            type = typeof root;
            if (type !== "object") {
                throw new Error("A non-container object was found at segment " + prop + ". Value: " + root);
            }
            prop = tokenized[i];
            if (root[prop] === undefined) {
                root[prop] = {};
            }
        }
        root[prop] = value;

        return value;
    };

    flock.invoke = function (root, path, args) {
        var fn = typeof root === "function" ? root : flock.get(root, path);
        if (typeof fn !== "function") {
            throw new Error("Path '" + path + "' does not resolve to a function.");
        }
        return fn.apply(null, args);
    };


    flock.input = {};

    flock.input.shouldExpand = function (inputName, target) {
        var specialInputs = flock.parse.specialInputs;
        if (target && target.options && target.options.noExpand) {
            specialInputs = specialInputs.concat(target.options.noExpand);
        }

        return specialInputs.indexOf(inputName) < 0;
    };

    flock.input.pathExpander = function (path) {
        return path.replace(/\.(?![0-9])/g, ".inputs.");
    };

    flock.input.expandPaths = function (paths) {
        var expanded = {},
            path,
            expandedPath,
            value;

        for (path in paths) {
            expandedPath = flock.input.pathExpander(path);
            value = paths[path];
            expanded[expandedPath] = value;
        }

        return expanded;
    };

    flock.input.expandPath = function (path) {
        return (typeof path === "string") ? flock.input.pathExpander(path) : flock.input.expandPaths(path);
    };

    flock.input.getValueForPath = function (root, path) {
        path = flock.input.expandPath(path);
        var input = flock.get(root, path);

        // If the unit generator is a valueType ugen, return its value, otherwise return the ugen itself.
        return flock.hasTag(input, "flock.ugen.valueType") ? input.model.value : input;
    };

    flock.input.getValuesForPathArray = function (root, paths) {
        var values = {},
            i,
            path;

        for (i = 0; i < paths.length; i++) {
            path = paths[i];
            values[path] = flock.input.get(root, path);
        }

        return values;
    };

    flock.input.getValuesForPathObject = function (root, pathObj) {
        var key;

        for (key in pathObj) {
            pathObj[key] = flock.input.get(root, key);
        }

        return pathObj;
    };

    /**
     * Gets the value of the ugen at the specified path.
     *
     * @param {String} path the ugen's path within the synth graph
     * @return {Number|UGen} a scalar value in the case of a value ugen, otherwise the ugen itself
     */
    flock.input.get = function (root, path) {
        return typeof path === "string" ? flock.input.getValueForPath(root, path) :
            flock.isIterable(path) ? flock.input.getValuesForPathArray(root, path) :
            flock.input.getValuesForPathObject(root, path);
    };

    flock.input.setValueForPath = function (root, path, val, baseTarget, valueParser) {
        path = flock.input.expandPath(path);

        var previousInput = flock.get(root, path),
            lastDotIdx = path.lastIndexOf("."),
            inputName = path.slice(lastDotIdx + 1),
            target = lastDotIdx > -1 ? flock.get(root, path.slice(0, path.lastIndexOf(".inputs"))) : baseTarget,
            newInput = flock.input.shouldExpand(inputName, target) && valueParser ?
                valueParser(val, path, target, previousInput) : val;

        flock.set(root, path, newInput);

        if (target && target.onInputChanged) {
            target.onInputChanged(inputName);
        }

        return newInput;
    };

    flock.input.setValuesForPaths = function (root, valueMap, baseTarget, valueParser) {
        var resultMap = {},
            path,
            val,
            result;

        for (path in valueMap) {
            val = valueMap[path];
            result = flock.input.set(root, path, val, baseTarget, valueParser);
            resultMap[path] = result;
        }

        return resultMap;
    };

    /**
     * Sets the value of the ugen at the specified path.
     *
     * @param {String} path the ugen's path within the synth graph
     * @param {Number || UGenDef} val a scalar value (for Value ugens) or a UGenDef object
     * @return {UGen} the newly created UGen that was set at the specified path
     */
    flock.input.set = function (root, path, val, baseTarget, valueParser) {
        return typeof path === "string" ?
            flock.input.setValueForPath(root, path, val, baseTarget, valueParser) :
            flock.input.setValuesForPaths(root, path, baseTarget, valueParser);
    };


    fluid.defaults("flock.nodeList", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        members: {
            nodes: [],
            namedNodes: {}
        }
    });

    flock.nodeList.preInit = function (that) {
        that.head = function (node) {
            that.nodes.unshift(node);
            if (node.nickName) {
                that.namedNodes[node.nickName] = node;
            }
            return 0;
        };

        that.before = function (refNode, node) {
            var refIdx = that.nodes.indexOf(refNode);
            that.insert(refIdx, node);
            return refIdx;
        };

        that.after = function (refNode, node) {
            var refIdx = that.nodes.indexOf(refNode),
                atIdx = refIdx + 1;
            that.insert(atIdx, node);
            return atIdx;
        };

        that.insert = function (idx, node) {
            if (idx < 0) {
                return that.head(node);
            }

            that.nodes.splice(idx, 0, node);
            if (node.nickName) {
                that.namedNodes[node.nickName] = node;
            }
            return idx;
        };

        that.tail = function (node) {
            that.nodes.push(node);
            if (node.nickName) {
                that.namedNodes[node.nickName] = node;
            }
            return that.nodes.length;
        };

        that.remove = function (node) {
            var idx = that.nodes.indexOf(node);
            if (idx < 0) {
                return idx;
            }

            that.nodes.splice(idx, 1);
            delete that.namedNodes[node.nickName];
            return idx;
        };

        that.replace = function (newNode, oldNode) {
            var idx = that.nodes.indexOf(oldNode);
            if (idx < 0) {
                return that.head(newNode);
            }

            that.nodes[idx] = newNode;
            delete that.namedNodes[oldNode.nickName];

            if (newNode.nickName) {
                that.namedNodes[newNode.nickName] = newNode;
            }
            return idx;
        };
    };


    /***********************
     * Synths and Playback *
     ***********************/

    fluid.defaults("flock.enviro", {
        gradeNames: ["fluid.modelComponent", "flock.nodeList", "autoInit"],
        model: {
            playState: {
                written: 0,
                total: null
            },

            isPlaying: false
        },
        audioSettings: {
            rates: {
                audio: 48000, // This is only a hint. Some audio backends (such as the Web Audio API)
                              // may define the sample rate themselves.
                control: undefined, // Control rate is calculated dynamically based on the audio rate and the block size.
                scheduled: undefined, // The scheduled rate is a user-specified parameter.
                demand: 0,
                constant: 0
            },
            blockSize: 64,
            chans: 2,
            numBuses: 8,
            // This buffer size determines the overall latency of Flocking's audio output.
            // TODO: Replace this with IoC awesomeness.
            bufferSize: flock.defaultBufferSizeForPlatform(),

            // Hints to some audio backends.
            genPollIntervalFactor: flock.platform.isLinux ? 1 : 20 // Only used on Firefox.
        },
        components: {
            asyncScheduler: {
                type: "flock.scheduler.async"
            },

            audioStrategy: {
                type: "flock.enviro.audioStrategy",
                options: {
                    audioSettings: "{enviro}.options.audioSettings",
                    model: {
                        playState: "{enviro}.model.playState"
                    }
                }
            }
        }
    });

    flock.enviro.preInit = function (that) {
        that.audioSettings = that.options.audioSettings;
        that.buses = flock.enviro.createAudioBuffers(that.audioSettings.numBuses,
                that.audioSettings.blockSize);
        that.buffers = {};
        that.bufferSources = {};

        /**
         * Starts generating samples from all synths.
         *
         * @param {Number} dur optional duration to play in seconds
         */
        that.play = function (dur) {
            dur = dur === undefined ? Infinity : dur;

            var playState = that.model.playState,
                sps = dur * that.audioSettings.rates.audio * that.audioSettings.chans;

            playState.total = playState.written + sps;
            that.audioStrategy.startGeneratingSamples();
            that.model.isPlaying = true;
        };

        /**
         * Stops generating samples from all synths.
         */
        that.stop = function () {
            that.audioStrategy.stopGeneratingSamples();
            that.model.isPlaying = false;
        };

        that.reset = function () {
            that.stop();
            that.asyncScheduler.clearAll();
            // Clear the environment's node list.
            while (that.nodes.length > 0) {
                that.nodes.pop();
            }
        };

        that.registerBuffer = function (bufDesc) {
            if (bufDesc.id) {
                that.buffers[bufDesc.id] = bufDesc;
            }
        };

        that.releaseBuffer = function (bufDesc) {
            if (!bufDesc) {
                return;
            }

            var id = typeof bufDesc === "string" ? bufDesc : bufDesc.id;
            delete that.buffers[id];
        };
    };

    flock.enviro.finalInit = function (that) {
        var audioSettings = that.options.audioSettings,
            rates = audioSettings.rates;

        that.gen = function () {
            var evaluator = that.audioStrategy.nodeEvaluator;
            evaluator.clearBuses();
            evaluator.gen();
        };

        // TODO: Model-based (with ChangeApplier) sharing of audioSettings
        rates.audio = that.audioStrategy.options.audioSettings.rates.audio;
        rates.control = rates.audio / audioSettings.blockSize;
        audioSettings.chans = that.audioStrategy.options.audioSettings.chans;
    };

    flock.enviro.createAudioBuffers = function (numBufs, blockSize) {
        var bufs = [],
            i;
        for (i = 0; i < numBufs; i++) {
            bufs[i] = new Float32Array(blockSize);
        }
        return bufs;
    };

    fluid.defaults("flock.enviro.audioStrategy", {
        gradeNames: ["fluid.modelComponent"],

        components: {
            nodeEvaluator: {
                type: "flock.enviro.nodeEvaluator",
                options: {
                    numBuses: "{enviro}.options.audioSettings.numBuses",
                    blockSize: "{enviro}.options.audioSettings.blockSize",
                    members: {
                        buses: "{enviro}.buses",
                        nodes: "{enviro}.nodes"
                    }
                }
            }
        }
    });

    /*****************
     * Node Evalutor *
     *****************/

    fluid.defaults("flock.enviro.nodeEvaluator", {
        gradeNames: ["fluid.littleComponent", "autoInit"]
    });

    flock.enviro.nodeEvaluator.finalInit = function (that) {
        that.clearBuses = function () {
            var numBuses = that.options.numBuses,
                busLen = that.options.blockSize,
                i,
                bus,
                j;

            for (i = 0; i < numBuses; i++) {
                bus = that.buses[i];
                for (j = 0; j < busLen; j++) {
                    bus[j] = 0;
                }
            }
        };

        that.gen = function () {
            var nodes = that.nodes,
                i,
                node;

            for (i = 0; i < nodes.length; i++) {
                node = nodes[i];
                node.gen(node.model.blockSize);
            }
        };
    };


    fluid.defaults("flock.autoEnviro", {
        gradeNames: ["fluid.littleComponent", "autoInit"]
    });

    flock.autoEnviro.preInit = function () {
        if (!flock.enviro.shared) {
            flock.init();
        }
    };


    fluid.defaults("flock.node", {
        gradeNames: ["flock.autoEnviro", "fluid.modelComponent", "autoInit"]
    });

    fluid.defaults("flock.ugenNodeList", {
        gradeNames: ["flock.nodeList", "autoInit"]
    });

    flock.ugenNodeList.finalInit = function (that) {

        /**
         * Inserts a unit generator and all its inputs into the node list, starting at the specified index.
         * Note that the node itself will not be insert into the list at this index--its inputs must
         * must be ahead of it in the list.
         *
         * @param {Number} idx the index to start adding the new node and its inputs at
         * @param {UGen} node the node to add, along with its inputs
         * @return {Number} the index at which the specified node was inserted
         */
        that.insertTree = function (idx, node) {
            var inputs = node.inputs,
                key,
                input;

            for (key in inputs) {
                input = inputs[key];
                if (typeof input !== "number") {
                    idx = that.insertTree(idx, input);
                    idx++;
                }
            }

            return that.insert(idx, node);
        };

        /**
         * Removes the specified unit generator and all its inputs from the node list.
         *
         * @param {UGen} node the node to remove along with its inputs
         * @return {Number} the index at which the node was removed
         */
        that.removeTree = function (node) {
            var inputs = node.inputs,
                key,
                input;

            for (key in inputs) {
                input = inputs[key];
                if (typeof input !== "number") {
                    that.removeTree(input);
                }
            }

            return that.remove(node);
        };

        /**
         * Replaces one node and all its inputs with a new node and its inputs.
         *
         * @param {UGen} newNode the node to add to the list
         * @param {UGen} oldNode the node to remove from the list
         * @return {Number} idx the index at which the new node was added
         */
        that.replaceTree = function (newNode, oldNode) {
            if (!oldNode) {
                 // Can't use .tail() because it won't recursively add inputs.
                return that.insertTree(that.nodes.length, newNode);
            }

            var idx = that.removeTree(oldNode);
            that.insertTree(idx, newNode);

            return idx;
        };

        /**
         * Swaps one node in the list for another in place, attaching the previous unit generator's
         * inputs to the new one. If a list of inputsToReattach is specified, only these inputs will
         * be swapped.
         *
         * Note that this function will directly modify the nodes in question.
         *
         * @param {UGen} newNode the node to add to the list, swapping it in place for the old one
         * @param {UGen} oldNode the node remove from the list
         * @param {Array} inputsToReattach a list of inputNames to attach to the new node from the old one
         * @return the index at which the new node was inserted
         */
        that.swapTree = function (newNode, oldNode, inputsToReattach) {
            var inputName;

            if (!inputsToReattach) {
                newNode.inputs = oldNode.inputs;
            } else {
                for (inputName in oldNode.inputs) {
                    if (inputsToReattach.indexOf(inputName) < 0) {
                        that.removeTree(oldNode.inputs[inputName]);
                    } else {
                        newNode.inputs[inputName] = oldNode.inputs[inputName];
                    }
                }

                for (inputName in newNode.inputs) {
                    if (inputsToReattach.indexOf(inputName) < 0) {
                        that.replaceTree(newNode.inputs[inputName], oldNode.inputs[inputName]);
                    }
                }
            }

            return that.replace(newNode, oldNode);
        };
    };

    fluid.defaults("flock.synth", {
        gradeNames: ["fluid.eventedComponent", "flock.node", "flock.ugenNodeList", "autoInit"],

        invokers: {
            /**
             * Plays the synth. This is a convenience method that will add the synth to the tail of the
             * environment's node graph and then play the environmnent.
             *
             * @param {Number} dur optional duration to play this synth in seconds
             */
            play: {
                funcName: "flock.synth.play",
                args: ["{that}", "{that}.enviro"]
            },

            /**
             * Stops the synth if it is currently playing.
             * This is a convenience method that will remove the synth from the environment's node graph.
             */
            pause: {
                funcName: "flock.synth.pause",
                args: ["{that}", "{that}.enviro"]
            }
        },

        rate: flock.rates.AUDIO
    });

    flock.synth.play = function (that, en) {
        if (en.nodes.indexOf(that) === -1) {
            en.head(that);
        }

        if (!en.model.isPlaying) {
            en.play();
        }
    };

    flock.synth.pause = function (that, en) {
        en.remove(that);
    };

    /**
     * Synths represent a collection of signal-generating units, wired together to form an instrument.
     * They are created with a synthDef object, a declarative structure describing the synth's unit generator graph.
     */
    flock.synth.finalInit = function (that) {
        that.rate = that.options.rate;
        that.enviro = that.enviro || flock.enviro.shared;
        that.audioSettings = $.extend(true, {}, that.enviro.audioSettings, that.options.audioSettings);
        that.model.blockSize = that.rate === flock.rates.AUDIO ? that.audioSettings.blockSize : 1;

        /**
         * Generates one block of audio rate signal by evaluating this synth's unit generator graph.
         */
        that.gen = function () {
            var nodes = that.nodes,
                i,
                node;

            for (i = 0; i < nodes.length; i++) {
                node = nodes[i];
                if (node.gen !== undefined) {
                    node.gen(node.model.blockSize);
                }
            }
        };

        /**
         * Gets the value of the ugen at the specified path.
         *
         * @param {String} path the ugen's path within the synth graph
         * @return {Number|UGen} a scalar value in the case of a value ugen, otherwise the ugen itself
         */
        that.get = function (path) {
            return flock.input.get(that.namedNodes, path);
        };


        /**
         * Sets the value of the ugen at the specified path.
         *
         * @param {String} path the ugen's path within the synth graph
         * @param {Number || UGenDef} val a scalar value (for Value ugens) or a UGenDef object
         * @return {UGen} the newly created UGen that was set at the specified path
         */
        that.set = function (path, val, swap) {
            return flock.input.set(that.namedNodes, path, val, undefined, function (ugenDef, path, target, prev) {
                return flock.synth.ugenValueParser(that, ugenDef, prev, swap);
            });
        };

        /**
         * Gets or sets the value of a ugen at the specified path
         *
         * @param {String} path the ugen's path within the synth graph
         * @param {Number || UGenDef || Array} val an optional value to to set--a scalar value, a UGenDef object, or an array of UGenDefs
         * @param {Boolean || Object} swap specifies if the existing inputs should be swapped onto the new value
         * @return {Number || UGenDef || Array} the value that was set or retrieved
         */
        that.input = function (path, val, swap) {
            return !path ? undefined : typeof path === "string" ?
                arguments.length < 2 ? that.get(path) : that.set(path, val, swap) :
                flock.isIterable(path) ? that.get(path) : that.set(path, val, swap);
        };

        that.init = function () {
            var o = that.options,
                // At demand or schedule rates, override the rate of all non-constant ugens.
                overrideRate = o.rate === flock.rates.SCHEDULED || o.rate === flock.rates.DEMAND;

            if (!o.synthDef) {
                fluid.log(fluid.logLevel.IMPORTANT,
                    "Warning: Instantiating a flock.synth instance with an empty synth def.");
            }

            // Parse the synthDef into a graph of unit generators.
            that.out = flock.parse.synthDef(o.synthDef, {
                rate: o.rate,
                overrideRate: overrideRate,
                visitors: that.tail,
                buffers: that.enviro.buffers,
                buses: that.enviro.buses,
                audioSettings: that.audioSettings
            });

            // Add this synth to the tail of the synthesis environment if appropriate.
            if (o.addToEnvironment !== false) {
                that.enviro.tail(that);
            }
        };

        that.init();
        return that;
    };

    flock.synth.ugenValueParser = function (that, ugenDef, prev, swap) {
        if (ugenDef === null || ugenDef === undefined) {
            return prev;
        }

        var parsed = flock.parse.ugenDef(ugenDef, {
            audioSettings: that.audioSettings,
            buses: that.enviro.buses,
            buffers: that.enviro.buffers
        });

        var newUGens = flock.isIterable(parsed) ? parsed : (parsed !== undefined ? [parsed] : []),
            oldUGens = flock.isIterable(prev) ? prev : (prev !== undefined ? [prev] : []);

        var replaceLen = Math.min(newUGens.length, oldUGens.length),
            replaceFn = swap ? that.swapTree : that.replaceTree,
            i,
            atIdx,
            j;

        // TODO: Improve performance by handling arrays inline instead of repeated function calls.
        for (i = 0; i < replaceLen; i++) {
            atIdx = replaceFn(newUGens[i], oldUGens[i]);
        }

        for (j = i; j < newUGens.length; j++) {
            atIdx++;
            that.insertTree(atIdx, newUGens[j]);
        }

        for (j = i; j < oldUGens.length; j++) {
            that.removeTree(oldUGens[j]);
        }

        return parsed;
    };

    /**
     * Makes a new synth.
     * Deprecated. Use flock.synth instead. This is provided for semi-backwards-compatibility with
     * previous version of Flocking where flock.synth had a multi-argument signature.
     */
    flock.synth.make = function (def, options) {
        options = options || {};
        options.synthDef = def;
        return flock.synth(options);
    };

    fluid.defaults("flock.synth.value", {
        gradeNames: ["flock.synth", "autoInit"],

        rate: "demand",

        addToEnvironment: false
    });

    flock.synth.value.finalInit = function (that) {
        that.value = function () {
            var nodes = that.nodes,
                lastIdx = nodes.length - 1,
                out = nodes[lastIdx];

            that.gen(1);

            return out.model.value;
        };
    };


    fluid.defaults("flock.synth.frameRate", {
        gradeNames: ["flock.synth.value", "autoInit"],

        rate: "scheduled",

        fps: 60,

        audioSettings: {
            rates: {
                scheduled: "{that}.options.fps"
            }
        }
    });


    fluid.defaults("flock.synth.group", {
        gradeNames: ["fluid.eventedComponent", "flock.node", "flock.nodeList", "autoInit"],
        rate: flock.rates.AUDIO
    });

    flock.synth.group.finalInit = function (that) {
        that.rate = that.options.rate;
        that.enviro = that.enviro || flock.enviro.shared;

        flock.synth.group.makeDispatchedMethods(that, [
            "input", "get", "set", "gen", "play", "pause"
        ]);

        that.init = function () {
            if (that.options.addToEnvironment !== false) {
                that.enviro.tail(that);
            }
        };

        that.init();
    };

    flock.synth.group.makeDispatcher = function (nodes, msg) {
        return function () {
            var i,
                node,
                val;
            for (i = 0; i < nodes.length; i++) {
                node = nodes[i];
                val = node[msg].apply(node, arguments);
            }

            return val;
        };
    };

    flock.synth.group.makeDispatchedMethods = function (that, methodNames) {
        var name,
            i;

        for (i = 0; i < methodNames.length; i++) {
            name = methodNames[i];
            that[name] = flock.synth.group.makeDispatcher(that.nodes, name, flock.synth.group.dispatch);
        }

        return that;
    };


    fluid.defaults("flock.synth.polyphonic", {
        gradeNames: ["flock.synth.group", "autoInit"],
        noteSpecs: {
            on: {
                "env.gate": 1
            },
            off: {
                "env.gate": 0
            }
        },
        maxVoices: 16,
        initVoicesLazily: true,
        amplitudeKey: "env.sustain",
        amplitudeNormalizer: "static" // "dynamic", "static", Function, falsey
    });

    flock.synth.polyphonic.finalInit = function (that) {
        that.activeVoices = {};
        that.freeVoices = [];

        that.noteChange = function (voice, eventName, changeSpec) {
            var noteEventSpec = that.options.noteSpecs[eventName];
            changeSpec = $.extend({}, noteEventSpec, changeSpec);
            voice.input(changeSpec);
        };

        that.noteOn = function (noteName, changeSpec) {
            var voice = that.nextFreeVoice();
            if (that.activeVoices[noteName]) {
                that.noteOff(noteName);
            }
            that.activeVoices[noteName] = voice;
            that.noteChange(voice, "on", changeSpec);

            return voice;
        };

        that.noteOff = function (noteName, changeSpec) {
            var voice = that.activeVoices[noteName];
            if (!voice) {
                return null;
            }
            that.noteChange(voice, "off", changeSpec);
            delete that.activeVoices[noteName];
            that.freeVoices.push(voice);

            return voice;
        };

        that.createVoice = function () {
            var voice = flock.synth({
                synthDef: that.options.synthDef,
                addToEnvironment: false
            });

            var normalizer = that.options.amplitudeNormalizer,
                ampKey = that.options.amplitudeKey,
                normValue;

            if (normalizer) {
                if (typeof normalizer === "function") {
                    normalizer(voice, ampKey);
                } else if (normalizer === "static") {
                    normValue = 1.0 / that.options.maxVoices;
                    voice.input(ampKey, normValue);
                }
                // TODO: Implement dynamic voice normalization.
            }
            that.nodes.push(voice);

            return voice;
        };

        that.pooledVoiceAllocator = function () {
            return that.freeVoices.pop();
        };

        that.lazyVoiceAllocator = function () {
            return that.freeVoices.length > 1 ?
                that.freeVoices.pop() : Object.keys(that.activeVoices).length > that.options.maxVoices ?
                null : that.createVoice();
        };

        that.init = function () {
            if (!that.options.initVoicesLazily) {
                var i;
                for (i = 0; i < that.options.maxVoices; i++) {
                    that.freeVoices[i] = that.createVoice();
                }
                that.nextFreeVoice = that.pooledVoiceAllocator;
            } else {
                that.nextFreeVoice = that.lazyVoiceAllocator;
            }
        };

        that.init();
        return that;
    };

    /**
     * flock.band provides an IoC-friendly interface for a collection of named synths.
     */
    // TODO: Unit tests.
    fluid.defaults("flock.band", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],

        invokers: {
            play: {
                func: "{that}.events.onPlay.fire"
            },

            pause: {
                func: "{that}.events.onPause.fire"
            },

            set: {
                func: "{that}.events.onSet.fire"
            }
        },

        events: {
            onPlay: null,
            onPause: null,
            onSet: null
        },

        distributeOptions: {
            source: "{that}.options.synthListeners",
            removeSource: true,
            target: "{that flock.synth}.options.listeners"
        },

        synthListeners: {
            "{band}.events.onPlay": {
                func: "{that}.play"
            },

            "{band}.events.onPause": {
                func: "{that}.pause"
            }
        }
    });

    /*******************************
     * Error Handling Conveniences *
     *******************************/

    flock.bufferDesc = function () {
        throw new Error("flock.bufferDesc is not defined. Did you forget to include the flocking-buffers.js file?");
    };
}());
;/*
* Flocking Audio Buffers
* http://github.com/colinbdclark/flocking
*
* Copyright 2013-14, Colin Clark
* Dual licensed under the MIT and GPL Version 2 licenses.
*/

/*global require*/
/*jshint white: false, newcap: true, regexp: true, browser: true,
    forin: false, nomen: true, bitwise: false, maxerr: 100,
    indent: 4, plusplus: false, curly: true, eqeqeq: true,
    freeze: true, latedef: true, noarg: true, nonew: true, quotmark: double, undef: true,
    unused: true, strict: true, asi: false, boss: false, evil: false, expr: false,
    funcscope: false*/

var fluid = fluid || require("infusion"),
    flock = fluid.registerNamespace("flock");
    
(function () {
    "use strict";
    
    // Based on Brian Cavalier and John Hann's Tiny Promises library.
    // https://github.com/unscriptable/promises/blob/master/src/Tiny2.js
    function Promise() {
        var resolve = function (result) {
            complete("resolve", result);
            promise.state = "fulfilled";
        };
        
        var reject = function (err) {
            complete("reject", err);
            promise.state = "rejected";
        };
        
        var then = function (resolve, reject) {
            if (callbacks) {
                callbacks.push({
                    resolve: resolve, 
                    reject: reject 
                });
            } else {
                var fn = promise.state === "fulfilled" ? resolve : reject;
                fn(promise.value);
            }

            return this;
        };
        
        var callbacks = [],
            promise = {
                state: "pending",
                value: undefined,
                resolve: resolve,
                reject: reject,
                then: then,
                safe: {
                    then: function safeThen(resolve, reject) {
                        promise.then(resolve, reject);
                        return this;
                    }
                }
            };

        
        function complete(type, result) {
            var rejector = function (resolve, reject) {
                reject(result); 
                return this;
            };
            
            var resolver = function (resolve) {
                resolve(result); 
                return this;
            };
            
            promise.value = result;
            promise.then = type === "reject" ? rejector : resolver;
            promise.resolve = promise.reject = function () {
                throw new Error("Promise already completed");
            };
            
            invokeCallbacks(type, result);
        }

        function invokeCallbacks (type, result) {
            var i,
                cb;
            
            for (i = 0; i < callbacks.length; i++) {
                cb = callbacks[i];
                
                if (cb[type]) {
                    cb[type](result);
                }
            }
            
            callbacks = null;
        }

        return promise;
    }
    
    fluid.defaults("flock.promise", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        
        members: {
            promise: {
                expander: {
                    funcName: "flock.promise.make"
                }
            }
        }
    });
    
    flock.promise.make = function () {
        return new Promise();
    };
    
    flock.bufferDesc = function (data) {
        data.container = data.container || {};
        data.format = data.format || {};

        data.format.sampleRate = data.format.sampleRate || 44100;
        data.format.numChannels = data.format.numChannels || data.data.channels.length;
        data.format.numSampleFrames = data.format.numSampleFrames || data.data.channels[0].length;
        data.format.duration = data.format.numSampleFrames / data.format.sampleRate;
        
        return data;
    };

    /**
     * Represents a source for fetching buffers.
     */
    fluid.defaults("flock.bufferSource", {
        gradeNames: ["fluid.eventedComponent", "fluid.modelComponent", "autoInit"],
        
        model: {
            state: "start",
            src: null
        },
        
        components: {
            bufferPromise: {
                createOnEvent: "onRefreshPromise",
                type: "flock.promise",
                options: {
                    listeners: {
                        onCreate: {
                            "this": "{that}.promise",
                            method: "then",
                            args: ["{bufferSource}.events.afterFetch.fire", "{bufferSource}.events.onError.fire"]
                        }
                    }
                }
            }
        },
        
        invokers: {
            get: {
                funcName: "flock.bufferSource.get",
                args: ["{that}", "{arguments}.0"]
            },
            
            set: {
                funcName: "flock.bufferSource.set",
                args: ["{that}", "{arguments}.0"]
            },
            
            error: {
                funcName: "flock.bufferSource.error",
                args: ["{that}", "{arguments}.0"]
            }
        },
        
        listeners: {
            onCreate: {
                funcName: "{that}.events.onRefreshPromise.fire"
            },
            
            onRefreshPromise: {
                funcName: "{that}.applier.requestChange",
                args: ["state", "start"]
            },
            
            onFetch: {
                funcName: "{that}.applier.requestChange",
                args: ["state", "in-progress"]
            },
            
            afterFetch: [
                {
                    funcName: "{that}.applier.requestChange",
                    args: ["state", "fetched"]
                },
                {
                    funcName: "{that}.events.onBufferUpdated.fire", // TODO: Replace with boiling?
                    args: ["{arguments}.0"]
                }
            ],
            
            onBufferUpdated: {
                // TODO: Hardcoded reference to shared environment.
                funcName: "flock.enviro.shared.registerBuffer",
                args: ["{arguments}.0"]
            },
            
            onError: {
                funcName: "{that}.applier.requestChange",
                args: ["state", "error"]
            }
        },
        
        events: {
            onRefreshPromise: null,
            onError: null,
            onFetch: null,
            afterFetch: null,
            onBufferUpdated: null
        }
    });
    
    flock.bufferSource.get = function (that, bufDef) {
        if (that.model.state === "in-progress" || (bufDef.src === that.model.src && !bufDef.replace)) {
            // We've already fetched the buffer or are in the process of doing so.
            return that.bufferPromise.promise;
        }

        if (bufDef.src) {
            if ((that.model.state === "fetched" || that.model.state === "errored") && 
                (that.model.src !== bufDef.src || bufDef.replace)) {
                that.events.onRefreshPromise.fire();
            }
            
            if (that.model.state === "start") {
                that.model.src = bufDef.src;
                that.events.onFetch.fire(bufDef);
                flock.audio.decode({
                    src: bufDef.src,
                    success: function (bufDesc) {
                        if (bufDef.id) {
                            bufDesc.id = bufDef.id;
                        }
                        
                        that.set(bufDesc);
                    },
                    error: that.error
                });
            }
        }
                
        return that.bufferPromise.promise;
    };
    
    flock.bufferSource.set = function (that, bufDesc) {
        var state = that.model.state;
        if (state === "start" || state === "in-progress") {
            that.bufferPromise.promise.resolve(bufDesc);
        }
        
        return that.bufferPromise.promise;
    };
    
    flock.bufferSource.error = function (that, msg) {
        that.bufferPromise.promise.reject(msg);
        
        return that.bufferPromise.promise;
    };

}());
;/*
* Flocking Parser
* http://github.com/colinbdclark/flocking
*
* Copyright 2011-2014, Colin Clark
* Dual licensed under the MIT and GPL Version 2 licenses.
*/

/*global require, Float32Array*/
/*jshint white: false, newcap: true, regexp: true, browser: true,
    forin: false, nomen: true, bitwise: false, maxerr: 100,
    indent: 4, plusplus: false, curly: true, eqeqeq: true,
    freeze: true, latedef: true, noarg: true, nonew: true, quotmark: double, undef: true,
    unused: true, strict: true, asi: false, boss: false, evil: false, expr: false,
    funcscope: false*/

var fluid = fluid || require("infusion"),
    flock = fluid.registerNamespace("flock");

(function () {
    "use strict";

    var $ = fluid.registerNamespace("jQuery");
    fluid.registerNamespace("flock.parse");

    flock.parse.synthDef = function (ugenDef, options) {
        if (!ugenDef) {
            ugenDef = [];
        }

        if (!flock.parse.synthDef.hasOutUGen(ugenDef)) {
            // We didn't get an out ugen specified, so we need to make one.
            ugenDef = {
                id: flock.OUT_UGEN_ID,
                ugen: "flock.ugen.valueOut",
                inputs: {
                    sources: ugenDef
                }
            };

            if (options.rate === flock.rates.AUDIO) {
                ugenDef.ugen = "flock.ugen.out";
                ugenDef.inputs.bus = 0;
                ugenDef.inputs.expand = options.audioSettings.chans;
            }
        }

        return flock.parse.ugenForDef(ugenDef, options);
    };

    flock.parse.synthDef.hasOutUGen = function (synthDef) {
        // TODO: This is hostile to third-party extension.
        return !flock.isIterable(synthDef) && (
            synthDef.id === flock.OUT_UGEN_ID ||
            synthDef.ugen === "flock.ugen.out" ||
            synthDef.ugen === "flock.ugen.valueOut"
        );
    };

    flock.parse.makeUGen = function (ugenDef, parsedInputs, options) {
        var rates = options.audioSettings.rates,
            blockSize = options.audioSettings.blockSize;

        // Assume audio rate if no rate was specified by the user.
        if (!ugenDef.rate) {
            ugenDef.rate = flock.rates.AUDIO;
        }

        var sampleRate;
        // Set the ugen's sample rate value according to the rate the user specified.
        if (ugenDef.options && ugenDef.options.sampleRate !== undefined) {
            sampleRate = ugenDef.options.sampleRate;
        } else {
            sampleRate = rates[ugenDef.rate];
        }

        // TODO: Infusion options merging!
        ugenDef.options = $.extend(true, {}, ugenDef.options, {
            sampleRate: sampleRate,
            rate: ugenDef.rate,
            audioSettings: {
                rates: rates,
                blockSize: blockSize
            }
        });
        // TODO: When we switch to Infusion options merging, these should have a mergePolicy of preserve.
        ugenDef.options.audioSettings.buffers = options.buffers;
        ugenDef.options.audioSettings.buses = options.buses;

        var outputBufferSize = ugenDef.rate === flock.rates.AUDIO ? blockSize : 1,
            outputBuffers;

        if (flock.hasTag(ugenDef.options, "flock.ugen.multiChannelOutput")) {
            var numOutputs = ugenDef.options.numOutputs || 1;
            outputBuffers = [];

            for (var i = 0; i < numOutputs; i++) {
                outputBuffers.push(new Float32Array(outputBufferSize));
            }
        } else {
            outputBuffers = new Float32Array(outputBufferSize);
        }

        return flock.invoke(undefined, ugenDef.ugen, [
            parsedInputs,
            outputBuffers,
            ugenDef.options
        ]);
    };


    flock.parse.reservedWords = ["id", "ugen", "rate", "inputs", "options"];
    flock.parse.specialInputs = ["value", "buffer", "table"];

    flock.parse.expandUGenDef = function (ugenDef) {
        var inputs = {},
            prop;

        // Copy any non-reserved properties from the top-level ugenDef object into the inputs property.
        for (prop in ugenDef) {
            if (flock.parse.reservedWords.indexOf(prop) === -1) {
                inputs[prop] = ugenDef[prop];
                delete ugenDef[prop];
            }
        }
        ugenDef.inputs = inputs;

        return ugenDef;
    };

    flock.parse.ugenDefForConstantValue = function (value) {
        return {
            ugen: "flock.ugen.value",
            rate: flock.rates.CONSTANT,
            inputs: {
                value: value
            }
        };
    };

    flock.parse.expandValueDef = function (ugenDef) {
        var type = typeof (ugenDef);
        if (type === "number") {
            return flock.parse.ugenDefForConstantValue(ugenDef);
        }

        if (type === "object") {
            return ugenDef;
        }

        throw new Error("Invalid value type found in ugen definition. UGenDef was: " +
            fluid.prettyPrintJSON(ugenDef));
    };

    flock.parse.rateMap = {
        "ar": flock.rates.AUDIO,
        "kr": flock.rates.CONTROL,
        "sr": flock.rates.SCHEDULED,
        "dr": flock.rates.DEMAND,
        "cr": flock.rates.CONSTANT
    };

    flock.parse.expandRate = function (ugenDef, options) {
        ugenDef.rate = flock.parse.rateMap[ugenDef.rate] || ugenDef.rate;
        if (options.overrideRate && ugenDef.rate !== flock.rates.CONSTANT) {
            ugenDef.rate = options.rate;
        }

        return ugenDef;
    };

    flock.parse.ugenDef = function (ugenDefs, options) {
        var parseFn = flock.isIterable(ugenDefs) ? flock.parse.ugensForDefs : flock.parse.ugenForDef;
        var parsed = parseFn(ugenDefs, options);
        return parsed;
    };

    flock.parse.ugenDef.mergeOptions = function (ugenDef) {
        // TODO: Infusion options merging.
        var defaults = fluid.defaults(ugenDef.ugen) || {};

        // TODO: Insane!
        defaults = fluid.copy(defaults);
        defaults.options = defaults.ugenOptions;
        delete defaults.ugenOptions;
        //

        return $.extend(true, {}, defaults, ugenDef);
    };

    flock.parse.ugensForDefs = function (ugenDefs, options) {
        var parsed = [],
            i;
        for (i = 0; i < ugenDefs.length; i++) {
            parsed[i] = flock.parse.ugenForDef(ugenDefs[i], options);
        }
        return parsed;
    };

    /**
     * Creates a unit generator for the specified unit generator definition spec.
     *
     * ugenDefs are plain old JSON objects describing the characteristics of the desired unit generator, including:
     *      - ugen: the type of unit generator, as string (e.g. "flock.ugen.sinOsc")
     *      - rate: the rate at which the ugen should be run, either "audio", "control", or "constant"
     *      - id: an optional unique name for the unit generator, which will make it available as a synth input
     *      - inputs: a JSON object containing named key/value pairs for inputs to the unit generator
     *           OR
     *      - inputs keyed by name at the top level of the ugenDef
     *
     * @param {UGenDef} ugenDef the unit generator definition to parse
     * @param {Object} options an options object containing:
     *           {Object} audioSettings the environment's audio settings
     *           {Array} buses the environment's global buses
     *           {Array} buffers the environment's global buffers
     *           {Array of Functions} visitors an optional list of visitor functions to invoke when the ugen has been created
     * @return the parsed unit generator object
     */
    flock.parse.ugenForDef = function (ugenDef, options) {
        options = $.extend(true, {
            audioSettings: flock.enviro.shared.options.audioSettings,
            buses: flock.enviro.shared.buses,
            buffers: flock.enviro.shared.buffers
        }, options);

        var o = options,
            visitors = o.visitors,
            rates = o.audioSettings.rates;

        // If we receive a plain scalar value, expand it into a value ugenDef.
        ugenDef = flock.parse.expandValueDef(ugenDef);

        // We received an array of ugen defs.
        if (flock.isIterable(ugenDef)) {
            return flock.parse.ugensForDefs(ugenDef, options);
        }

        if (!ugenDef.inputs) {
            ugenDef = flock.parse.expandUGenDef(ugenDef);
        }

        flock.parse.expandRate(ugenDef, options);
        ugenDef = flock.parse.ugenDef.mergeOptions(ugenDef, options);

        var inputDefs = ugenDef.inputs,
            inputs = {},
            inputDef;

        // TODO: This notion of "special inputs" should be refactored as a pluggable system of
        // "input expanders" that are responsible for processing input definitions of various sorts.
        // In particular, buffer management should be here so that we can initialize bufferDefs more
        // proactively and remove this behaviour from flock.ugen.buffer.
        for (inputDef in inputDefs) {
            var inputDefVal = inputDefs[inputDef];

            if (inputDefVal === null) {
                continue; // Skip null inputs.
            }

            // Create ugens for all inputs except special inputs.
            inputs[inputDef] = flock.input.shouldExpand(inputDef, ugenDef) ?
                flock.parse.ugenForDef(inputDefVal, options) : // Parse the ugendef and create a ugen instance.
                inputDefVal; // Don't instantiate a ugen, just pass the def on as-is.
        }

        if (!ugenDef.ugen) {
            throw new Error("Unit generator definition lacks a 'ugen' property; " +
                "can't initialize the synth graph. Value: " + fluid.prettyPrintJSON(ugenDef));
        }

        var ugen = flock.parse.makeUGen(ugenDef, inputs, options);
        if (ugenDef.id) {
            ugen.id = ugenDef.id;
            ugen.nickName = ugenDef.id; // TODO: Normalize nicknames and ids.
        }

        ugen.options.ugenDef = ugenDef;

        if (visitors) {
            visitors = fluid.makeArray(visitors);
            fluid.each(visitors, function (visitor) {
                visitor(ugen, ugenDef, rates);
            });
        }

        return ugen;
    };

    flock.parse.expandBufferDef = function (bufDef) {
        if (flock.isIterable(bufDef)) {
            // If we get a direct array reference, wrap it up in a buffer description.
            return flock.bufferDesc({
                data: {
                    channels: bufDef // TODO: What about bare single-channel arrays?
                }
            });
        }

        // If we get a bare string, interpret it as an id reference.
        return typeof (bufDef) !== "string" ? bufDef : {
            id: bufDef
        };
    };

    flock.parse.bufferForDef = function (bufDef, ugen, enviro) {
        bufDef = flock.parse.expandBufferDef(bufDef);

        if (bufDef.data && bufDef.data.channels) {
            flock.parse.bufferForDef.resolveBuffer(bufDef, ugen, enviro);
        } else {
            flock.parse.bufferForDef.resolveDef(bufDef, ugen, enviro);
        }
    };

    flock.parse.bufferForDef.findSource = function (defOrDesc, enviro) {
        var source;

        if (enviro && defOrDesc.id) {
            source = enviro.bufferSources[defOrDesc.id];
            if (!source) {
                source = enviro.bufferSources[defOrDesc.id] = flock.bufferSource();
            }
        } else {
            source = flock.bufferSource();
        }

        return source;
    };

    flock.parse.bufferForDef.bindToPromise = function (p, source, ugen) {
        // TODO: refactor this.
        var success = function (bufDesc) {
            source.events.onBufferUpdated.addListener(success);
            if (ugen) {
                ugen.setBuffer(bufDesc);
            }
        };

        var error = function (msg) {
            throw new Error("Error while resolving buffer " + source.model.src + ": " + msg);
        };

        p.then(success, error);
    };

    flock.parse.bufferForDef.resolveDef = function (bufDef, ugen, enviro) {
        var source = flock.parse.bufferForDef.findSource(bufDef, enviro),
            p;

        bufDef.src = bufDef.url || bufDef.src;
        if (bufDef.selector && typeof(document) !== "undefined") {
            bufDef.src = document.querySelector(bufDef.selector).files[0];
        }

        p = source.get(bufDef);
        flock.parse.bufferForDef.bindToPromise(p, source, ugen);
    };


    flock.parse.bufferForDef.resolveBuffer = function (bufDesc, ugen, enviro) {
        var source = flock.parse.bufferForDef.findSource(bufDesc, enviro),
            p = source.set(bufDesc);

        flock.parse.bufferForDef.bindToPromise(p, source, ugen);
    };

}());
;// TODO: This is a copy of polydataview.js, now inlined here to avoid script loading
// issues related to web workers. Ultimately, Flocking should shed its dependency on
// PolyDataView now that DataView ships in all major browsers.

/*
 * PolyDataView, a better polyfill for DataView.
 * http://github.com/colinbdclark/PolyDataView
 *
 * Copyright 2012, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 *
 * Contributions:
 *   - getFloat32 and getFloat64, Copyright 2011 Christopher Chedeau
 *   - getFloat80, Copyright 2011 Joe Turner
 */

/*global global, self, require, window, ArrayBuffer, Uint8Array, Uint32Array, Float32Array,
  File, FileReader, PolyDataView*/
/*jshint white: false, newcap: true, regexp: true, browser: true,
    forin: false, nomen: true, bitwise: false, maxerr: 100,
    indent: 4, plusplus: false, curly: true, eqeqeq: true,
    freeze: true, latedef: true, noarg: true, nonew: true, quotmark: double, undef: true,
    unused: true, strict: true, asi: false, boss: false, evil: false, expr: false,
    funcscope: false*/

/*
 * To Do:
 *  - Finish unit tests for getFloat80() and the various array getters.
 */

(function () {
    "use strict";

    var g = typeof (window) !== "undefined" ? window : typeof (self) !== "undefined" ? self : global;

    var nativeDataView = typeof (g.DataView) !== "undefined" ? g.DataView : undefined;

    var isHostLittleEndian = (function () {
        var endianTest = new ArrayBuffer(4),
            u8View = new Uint8Array(endianTest),
            u32View = new Uint32Array(endianTest);

        u8View[0] = 0x01;
        u8View[1] = 0x02;
        u8View[2] = 0x03;
        u8View[3] = 0x04;

        return u32View[0] === 0x04030201;
    }());


    var addSharedMethods = function (that) {

        /**
         * Non-standard
         */
        that.getString = function (len, w, o, isL) {
            o = typeof (o) === "number" ? o : that.offsetState;

            var s = "",
                i,
                c;

            for (i = 0; i < len; i++) {
                c = that.getUint(w, o, isL);
                if (c > 0xFFFF) {
                    c -= 0x10000;
                    s += String.fromCharCode(0xD800 + (c >> 10), 0xDC00 + (c & 0x3FF));
                } else {
                    s += String.fromCharCode(c);
                }
                o = o + w;
            }

            return s;
        };

        /**
         * Non-standard
         */
        that.getFloat80 = function (o, isL) {
            o = typeof (o) === "number" ? o : that.offsetState;

            // This method is a modified version of Joe Turner's implementation of an "extended" float decoder,
            // originally licensed under the WTF license.
            // https://github.com/oampo/audiofile.js/blob/master/audiofile.js
            var expon = that.getUint(2, o, isL),
                hi = that.getUint(4, o + 2),
                lo = that.getUint(4, o + 6),
                rng = 1 << (16 - 1),
                sign = 1,
                value;

            if (expon >= rng) {
                expon |= ~(rng - 1);
            }

            if (expon < 0) {
                sign = -1;
                expon += rng;
            }

            if (expon === hi === lo === 0) {
                value = 0;
            } else if (expon === 0x7FFF) {
                value = Number.MAX_VALUE;
            } else {
                expon -= 16383;
                value = (hi * 0x100000000 + lo) * Math.pow(2, expon - 63);
            }

            that.offsetState = o + 10;

            return sign * value;
        };
    };

    var PolyDataView = function (buffer, byteOffset, byteLength) {
        var cachedArray = [];

        var that = {
            buffer: buffer,
            byteOffset: typeof (byteOffset) === "number" ? byteOffset : 0
        };
        that.byteLength = typeof (byteLength) === "number" ? byteLength : buffer.byteLength - that.byteOffset;

        // Bail if we're trying to read off the end of the buffer.
        if (that.byteOffset > buffer.byteLength || that.byteOffset + that.byteLength > buffer.byteLength) {
            throw new Error("INDEX_SIZE_ERR: DOM Exception 1");
        }

        /**
         * Non-standard
         */
        that.u8Buf = new Uint8Array(buffer, that.byteOffset, that.byteLength);

        /**
         * Non-standard
         */
        that.offsetState = that.byteOffset;

        /**
         * Non-standard
         */
        that.getUints = function (len, w, o, isL, array) {
            // TODO: Complete cut and paste job from getInts()!
            o = typeof (o) === "number" ? o : that.offsetState;
            if (o + (len * w) > that.u8Buf.length) {
                throw new Error("INDEX_SIZE_ERR: DOM Exception 1");
            }

            that.offsetState = o + (len * w);
            var arrayType = g["Uint" + (w * 8) + "Array"];

            if (len > 1 && isHostLittleEndian === isL) {
                return new arrayType(that.buffer, o, len); // jshint ignore:line
            }

            array = array || new arrayType(len); // jshint ignore:line
            var startByte,
                idxInc,
                i,
                idx,
                n,
                j,
                scale,
                v;

            if (isL) {
                startByte = 0;
                idxInc = 1;
            } else {
                startByte = w - 1;
                idxInc = -1;
            }

            for (i = 0; i < len; i++) {
                idx = o + (i * w) + startByte;
                n = 0;
                for (j = 0, scale = 1; j < w; j++, scale *= 256) {
                    v = that.u8Buf[idx];
                    n += v * scale;
                    idx += idxInc;
                }
                array[i] = n;
            }

            return array;
        };

        /**
         * Non-standard
         */
        that.getInts = function (len, w, o, isL, array) {
            o = typeof (o) === "number" ? o : that.offsetState;
            if (o + (len * w) > that.u8Buf.length) {
                throw new Error("INDEX_SIZE_ERR: DOM Exception 1");
            }

            that.offsetState = o + (len * w);
            var arrayType = g["Int" + (w * 8) + "Array"];

            // If the host's endianness matches the file's, just use a typed array view directly.
            if (len > 1 && isHostLittleEndian === isL) {
                return new arrayType(that.buffer, o, len); // jshint ignore:line
            }

            array = array || new arrayType(len); // jshint ignore:line
            var mask = Math.pow(256, w),
                halfMask = (mask / 2) - 1,
                startByte,
                idxInc,
                i,
                idx,
                n,
                j,
                scale,
                v;

            if (isL) {
                startByte = 0;
                idxInc = 1;
            } else {
                startByte = w - 1;
                idxInc = -1;
            }

            for (i = 0; i < len; i++) {
                idx = o + (i * w) + startByte;
                n = 0;
                for (j = 0, scale = 1; j < w; j++, scale *= 256) {
                    v = that.u8Buf[idx];
                    n += v * scale;
                    idx += idxInc;
                }
                array[i] = n > halfMask ? n - mask : n;
            }

            return array;
        };

        /**
         * Non-standard
         */
        that.getFloats = function (len, w, o, isL, array) {
            var bits = w * 8,
                getterName = "getFloat" + bits,
                arrayType = g["Float" + bits + "Array"],
                i;

            // If the host's endianness matches the file's, just use a typed array view directly.
            if (len > 1 && isHostLittleEndian === isL) {
                o = typeof (o) === "number" ? o : that.offsetState;
                if (o + (len * w) > that.u8Buf.length) {
                    throw new Error("INDEX_SIZE_ERR: DOM Exception 1");
                }
                that.offsetState = o + (len * w);
                return new arrayType(that.buffer, o, len); // jshint ignore:line
            }

            array = array || new arrayType(len); // jshint ignore:line

            for (i = 0; i < len; i++) {
                array[i] = that[getterName](o, isL);
            }

            return array;
        };

        /**
         * Non-standard
         */
        that.getUint = function (w, o, isL) {
            return w === 1 ? that.getUint8(o, isL) : that.getUints(1, w, o, isL, cachedArray)[0];
        };

        /**
         * Non-standard
         */
        that.getInt = function (w, o, isL) {
            return that.getInts(1, w, o, isL, cachedArray)[0];
        };

        that.getUint8 = function (o) {
            o = typeof (o) === "number" ? o : that.offsetState;

            var n = that.u8Buf[o];
            that.offsetState = o + 1;

            return n;
        };

        that.getInt8 = function (o, isL) {
            return that.getInts(1, 1, o, isL, cachedArray)[0];
        };

        that.getUint16 = function (o, isL) {
            return that.getUints(1, 2, o, isL, cachedArray)[0];
        };

        that.getInt16 = function (o, isL) {
            return that.getInts(1, 2, o, isL, cachedArray)[0];
        };

        that.getUint32 = function (o, isL) {
            return that.getUints(1, 4, o, isL, cachedArray)[0];
        };

        that.getInt32 = function (o, isL) {
            return that.getInts(1, 4, o, isL, cachedArray)[0];
        };

        that.getFloat32 = function (o, isL) {
            // This method is a modified version of Christopher Chedeau's Float32 decoding
            // implementation from jDataView, originally distributed under the WTF license.
            // https://github.com/vjeux/jDataView
            var bytes = that.getUints(4, 1, o, isL),
                b0,
                b1,
                b2,
                b3,
                sign,
                exp,
                mant;

            if (isL) {
                b0 = bytes[3];
                b1 = bytes[2];
                b2 = bytes[1];
                b3 = bytes[0];
            } else {
                b0 = bytes[0];
                b1 = bytes[1];
                b2 = bytes[2];
                b3 = bytes[3];
            }

            sign = 1 - (2 * (b0 >> 7));
            exp = (((b0 << 1) & 255) | (b1 >> 7)) - 127;
            mant = ((b1 & 127) * 65536) | (b2 * 256) | b3;

            if (exp === 128) {
                return mant !== 0 ? NaN : sign * Infinity;
            }

            if (exp === -127) {
                return sign * mant * 1.401298464324817e-45;
            }

            return sign * (1 + mant * 1.1920928955078125e-7) * Math.pow(2, exp);
        };

        that.getFloat64 = function (o, isL) {
            // This method is a modified version of Christopher Chedeau's Float64 decoding
            // implementation from jDataView, originally distributed under the WTF license.
            // https://github.com/vjeux/jDataView
            var bytes = that.getUints(8, 1, o, isL),
                b0,
                b1,
                b2,
                b3,
                b4,
                b5,
                b6,
                b7,
                sign,
                exp,
                mant;

            if (isL) {
                b0 = bytes[7];
                b1 = bytes[6];
                b2 = bytes[5];
                b3 = bytes[4];
                b4 = bytes[3];
                b5 = bytes[2];
                b6 = bytes[1];
                b7 = bytes[0];
            } else {
                b0 = bytes[0];
                b1 = bytes[1];
                b2 = bytes[2];
                b3 = bytes[3];
                b4 = bytes[4];
                b5 = bytes[5];
                b6 = bytes[6];
                b7 = bytes[7];
            }

            sign = 1 - (2 * (b0 >> 7));
            exp = ((((b0 << 1) & 255) << 3) | (b1 >> 4)) - 1023;
            mant = ((b1 & 15) * 281474976710656) + (b2 * 1099511627776) + (b3 * 4294967296) +
                (b4 * 16777216) + (b5 * 65536) + (b6 * 256) + b7;

            if (exp === 1024) {
                return mant !== 0 ? NaN : sign * Infinity;
            }

            if (exp === -1023) {
                return sign * mant * 5e-324;
            }

            return sign * (1 + mant * 2.220446049250313e-16) * Math.pow(2, exp);
        };

        addSharedMethods(that);
        return that;
    };

    var wrappedDataView = function (buffer, byteOffset, byteLength) {
        var that = {
            buffer: buffer,
            byteOffset: typeof (byteOffset) === "number" ? byteOffset : 0
        };
        that.byteLength = typeof (byteLength) === "number" ? byteLength : buffer.byteLength - that.byteOffset;

        /**
         * Non-standard
         */
        that.dv = new nativeDataView(buffer, that.byteOffset, that.byteLength); // jshint ignore:line

        /**
         * Non-standard
         */
        that.offsetState = that.byteOffset;

        /**
         * Non-standard
         */
        that.getUint = function (w, o, isL) {
            o = typeof (o) === "number" ? o : that.offsetState;

            var n = that.dv["getUint" + (w * 8)](o, isL);
            that.offsetState = o + w;

            return n;
        };

        /**
         * Non-standard
         */
        that.getInt = function (w, o, isL) {
            o = typeof (o) === "number" ? o : that.offsetState;

            var n = that.dv["getInt" + (w * 8)](o, isL);
            that.offsetState = o + w;

            return n;
        };

        /**
         * Non-standard
         */
        var getBytes = function (type, len, w, o, isL, array) {
            var bits = w * 8,
                typeSize = type + bits,
                dv = that.dv,
                getterName = "get" + typeSize,
                i;

            array = array || new g[typeSize + "Array"](len);
            o = typeof (o) === "number" ? o : that.offsetState;

            for (i = 0; i < len; i++) {
                array[i] = dv[getterName](o, isL);
                o += w;
            }

            that.offsetState = o;

            return array;
        };

        /**
         * Non-standard
         */
        that.getUints = function (len, w, o, isL, array) {
            return getBytes("Uint", len, w, o, isL, array);
        };

        /**
         * Non-standard
         */
        that.getInts = function (len, w, o, isL, array) {
            return getBytes("Int", len, w, o, isL, array);
        };

        /**
         * Non-standard
         */
        that.getFloats = function (len, w, o, isL, array) {
            return getBytes("Float", len, w, o, isL, array);
        };

        that.getUint8 = function (o) {
            o = typeof (o) === "number" ? o : that.offsetState;

            var n = that.dv.getUint8(o);
            that.offsetState = o + 1;

            return n;
        };

        that.getInt8 = function (o) {
            o = typeof (o) === "number" ? o : that.offsetState;

            var n = that.dv.getInt8(o);
            that.offsetState = o + 1;

            return n;
        };

        that.getUint16 = function (o, isL) {
            o = typeof (o) === "number" ? o : that.offsetState;

            var n = that.dv.getUint16(o, isL);
            that.offsetState = o + 2;

            return n;
        };

        that.getInt16 = function (o, isL) {
            o = typeof (o) === "number" ? o : that.offsetState;

            var n = that.dv.getInt16(o, isL);
            that.offsetState = o + 2;

            return n;
        };

        that.getUint32 = function (o, isL) {
            o = typeof (o) === "number" ? o : that.offsetState;

            var n = that.dv.getUint32(o, isL);
            that.offsetState = o + 4;

            return n;
        };

        that.getInt32 = function (o, isL) {
            o = typeof (o) === "number" ? o : that.offsetState;

            var n = that.dv.getInt32(o, isL);
            that.offsetState = o + 4;

            return n;
        };

        that.getFloat32 = function (o, isL) {
            o = typeof (o) === "number" ? o : that.offsetState;

            var n = that.dv.getFloat32(o, isL);
            that.offsetState = o + 4;

            return n;
        };

        that.getFloat64 = function (o, isL) {
            o = typeof (o) === "number" ? o : that.offsetState;

            var n = that.dv.getFloat64(o, isL);
            that.offsetState = o + 8;

            return n;
        };

        addSharedMethods(that);
        return that;
    };

    g.PolyDataView = nativeDataView ? wrappedDataView : PolyDataView;

}());


/*
 * Flocking Audio File Decoder Library
 * http://github.com/colinbdclark/flocking
 *
 * Copyright 2011-2014, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */

// Stub out fluid.registerNamespace in cases where we're in a Web Worker and Infusion is unavailable.
var fluid = typeof (fluid) !== "undefined" ? fluid : typeof (require) !== "undefined" ? require("infusion") : {
    registerNamespace: function (path) {
        "use strict";

        if (!path) {
            return;
        }
        var root = self,
            tokens = path.split("."),
            i,
            token;

        for (i = 0; i < tokens.length; i++) {
            token = tokens[i];
            if (!root[token]) {
                root[token] = {};
            }
            root = root[token];
        }

        return root;
    }
};

var flock = fluid.registerNamespace("flock");

(function () {
    "use strict";

    var $ = fluid.registerNamespace("jQuery");

    /**
     * Applies the specified function in the next round of the event loop.
     */
    // TODO: Replace this and the code that depends on it with a good Promise implementation.
    flock.applyDeferred = function (fn, args, delay) {
        if (!fn) {
            return;
        }

        delay = typeof (delay) === "undefined" ? 0 : delay;
        setTimeout(function () {
            fn.apply(null, args);
        }, delay);
    };


    /*********************
     * Network utilities *
     *********************/

    fluid.registerNamespace("flock.net");

    /**
     * Loads an ArrayBuffer into memory using XMLHttpRequest.
     */
    flock.net.readBufferFromUrl = function (options) {
        var src = options.src,
            xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    options.success(xhr.response, flock.file.parseFileExtension(src));
                } else {
                    if (!options.error) {
                        throw new Error(xhr.statusText);
                    }

                    options.error(xhr.statusText);
                }
            }
        };

        xhr.open(options.method || "GET", src, true);
        xhr.responseType = options.responseType || "arraybuffer";
        xhr.send(options.data);
    };


    /*****************
     * File Utilties *
     *****************/

    fluid.registerNamespace("flock.file");

    flock.file.mimeTypes = {
        "audio/wav": "wav",
        "audio/x-wav": "wav",
        "audio/wave": "wav",
        "audio/x-aiff": "aiff",
        "audio/aiff": "aiff",
        "sound/aiff": "aiff"
    };

    flock.file.typeAliases = {
        "aif": "aiff",
        "wave": "wav"
    };

    flock.file.parseFileExtension = function (fileName) {
        var lastDot = fileName.lastIndexOf("."),
            ext,
            alias;

        // TODO: Better error handling in cases where we've got unrecognized file extensions.
        //       i.e. we should try to read the header instead of relying on extensions.
        if (lastDot < 0) {
            throw new Error("The file '" + fileName + "' does not have a valid extension.");
        }

        ext = fileName.substring(lastDot + 1);
        ext = ext.toLowerCase();
        alias =  flock.file.typeAliases[ext];

        return alias || ext;
    };

    flock.file.parseMIMEType = function (mimeType) {
        return flock.file.mimeTypes[mimeType];
    };

    /**
     * Converts a binary string to an ArrayBuffer, suitable for use with a DataView.
     *
     * @param {String} s the raw string to convert to an ArrayBuffer
     *
     * @return {Uint8Array} the converted buffer
     */
    flock.file.stringToBuffer = function (s) {
        var len = s.length,
            b = new ArrayBuffer(len),
            v = new Uint8Array(b),
            i;
        for (i = 0; i < len; i++) {
            v[i] = s.charCodeAt(i);
        }
        return v.buffer;
    };

    /**
     * Asynchronously parses the specified data URL into an ArrayBuffer.
     */
    flock.file.readBufferFromDataUrl = function (options) {
        var url = options.src,
            delim = url.indexOf(","),
            header = url.substring(0, delim),
            data = url.substring(delim + 1),
            base64Idx = header.indexOf(";base64"),
            isBase64 =  base64Idx > -1,
            mimeTypeStartIdx = url.indexOf("data:") + 5,
            mimeTypeEndIdx = isBase64 ? base64Idx : delim,
            mimeType = url.substring(mimeTypeStartIdx, mimeTypeEndIdx);

        if (isBase64) {
            data = atob(data);
        }

        flock.applyDeferred(function () {
            var buffer = flock.file.stringToBuffer(data);
            options.success(buffer, flock.file.parseMIMEType(mimeType));
        });
    };

    /**
     * Asynchronously reads the specified File into an ArrayBuffer.
     */
    flock.file.readBufferFromFile = function (options) {
        var reader  = new FileReader();
        reader.onload = function (e) {
            options.success(e.target.result, flock.file.parseFileExtension(options.src.name));
        };
        reader.readAsArrayBuffer(options.src);

        return reader;
    };


    fluid.registerNamespace("flock.audio");

    /**
     * Asychronously loads an ArrayBuffer into memory.
     *
     * Options:
     *  - src: the URL to load the array buffer from
     *  - method: the HTTP method to use (if applicable)
     *  - data: the data to be sent as part of the request (it's your job to query string-ize this if it's an HTTP request)
     *  - success: the success callback, which takes the ArrayBuffer response as its only argument
     *  - error: a callback that will be invoked if an error occurs, which takes the error message as its only argument
     */
    flock.audio.loadBuffer = function (options) {
        var src = options.src || options.url;
        if (!src) {
            return;
        }

        if (src instanceof ArrayBuffer) {
            flock.applyDeferred(options.success, [src, options.type]);
        }

        var reader = flock.audio.loadBuffer.readerForSource(src);

        reader(options);
    };

    flock.audio.loadBuffer.readerForSource = function (src) {
        return (typeof (File) !== "undefined" && src instanceof File) ? flock.file.readBufferFromFile :
            src.indexOf("data:") === 0 ? flock.file.readBufferFromDataUrl : flock.net.readBufferFromUrl;
    };


    /**
     * Loads and decodes an audio file. By default, this is done asynchronously in a Web Worker.
     * This decoder currently supports WAVE and AIFF file formats.
     */
    flock.audio.decode = function (options) {
        var success = options.success;

        var wrappedSuccess = function (rawData, type) {
            var decoders = flock.audio.decode,
                decoder;

            if (!options) {
                decoder = decoders.async;
            } else if (options.decoder) {
                decoder = typeof (options.decoder) === "string" ?
                    fluid.getGlobalValue(options.decoder) : options.decoder;
            } else if (options.async === false) {
                decoder = decoders.sync;
            } else {
                decoder = decoders.async;
            }

            decoder({
                rawData: rawData,
                type: type,
                success: success,
                error: options.error
            });
        };

        options.success = wrappedSuccess;
        flock.audio.loadBuffer(options);
    };

    /**
     * Synchronously decodes an audio file.
     */
    flock.audio.decode.sync = function (options) {
        try {
            var buffer = flock.audio.decodeArrayBuffer(options.rawData, options.type);
            options.success(buffer, options.type);
        } catch (e) {
            if (options.error) {
                options.error(e.msg);
            } else {
                throw e;
            }
        }
    };

    /**
     * Asynchronously decodes the specified rawData in a Web Worker.
     */
    flock.audio.decode.async = function (options) {
        var workerUrl = flock.audio.decode.async.findWorkerUrl(options),
            w = new Worker(workerUrl);

        w.addEventListener("message", function (e) {
            var data = e.data,
                msg = e.data.msg;

            if (msg === "afterDecoded") {
                options.success(data.buffer, data.type);
            } else if (msg === "onError") {
                options.error(data.errorMsg);
            }
        }, true);

        w.postMessage({
            msg: "decode",
            rawData: options.rawData,
            type: options.type
        });
    };

    flock.audio.decode.async.findWorkerUrl = function (options) {
        if (options && options.workerUrl) {
            return options.workerUrl;
        }

        var workerFileName = "flocking-audiofile-worker.js",
            flockingFileNames = flock.audio.decode.async.findWorkerUrl.flockingFileNames,
            i,
            fileName,
            scripts,
            src,
            idx,
            baseUrl;

        for (i = 0; i < flockingFileNames.length; i++) {
            fileName = flockingFileNames[i];
            scripts = $("script[src$='" + fileName + "']");
            if (scripts.length > 0) {
                break;
            }
        }

        if (scripts.length < 1) {
            throw new Error("Flocking error: could not load the Audio Decoder into a worker because " +
                "flocking-all.js or flocking-core.js could not be found.");
        }

        src = scripts.eq(0).attr("src");
        idx = src.indexOf(fileName);
        baseUrl = src.substring(0, idx);

        return baseUrl + workerFileName;
    };

    flock.audio.decode.async.findWorkerUrl.flockingFileNames = [
        "flocking-all.js",
        "flocking-all.min.js",
        "flocking-audiofile.js",
        "flocking-core.js"
    ];

    flock.audio.decodeArrayBuffer = function (data, type) {
        var formatSpec = flock.audio.formats[type];
        if (!formatSpec) {
            throw new Error("There is no decoder available for " + type + " files.");
        }

        return formatSpec.reader(data, formatSpec);
    };

    flock.audio.decode.deinterleaveSampleData = function (dataType, bits, numChans, interleaved) {
        var numFrames = interleaved.length / numChans,
            chans = [],
            i,
            samp = 0,
            max,
            frame,
            chan;

        // Initialize each channel.
        for (i = 0; i < numChans; i++) {
            chans[i] = new Float32Array(numFrames);
        }

        if (dataType === "Int") {
            max = Math.pow(2, bits - 1);
            for (frame = 0; frame < numFrames; frame++) {
                for (chan = 0; chan < numChans; chan++) {
                    chans[chan][frame] = interleaved[samp] / max;
                    samp++;
                }
            }
        } else {
            for (frame = 0; frame < numFrames; frame++) {
                for (chan = 0; chan < numChans; chan++) {
                    chans[chan][frame] = interleaved[samp];
                    samp++;
                }
            }

        }

        return chans;
    };

    flock.audio.decode.data = function (dv, format, dataType, isLittle) {
        var numChans = format.numChannels,
            numFrames = format.numSampleFrames,
            l = numFrames * numChans,
            bits = format.bitRate,
            interleaved = dv["get" + dataType + "s"](l, bits / 8, undefined, isLittle);

        return flock.audio.decode.deinterleaveSampleData(dataType, bits, numChans, interleaved);
    };

    flock.audio.decode.dataChunk = function (dv, format, dataType, data, isLittle) {
        var l = data.size;

        // Now that we've got the actual data size, correctly set the number of sample frames if it wasn't already present.
        format.numSampleFrames = format.numSampleFrames || (l / (format.bitRate / 8)) / format.numChannels;
        format.duration = format.numSampleFrames / format.sampleRate;

        // Read the channel data.
        data.channels = flock.audio.decode.data(dv, format, dataType, isLittle);

        return data;
    };

    flock.audio.decode.chunk = function (dv, id, type, headerLayout, layout, chunkIDs, metadata, isLittle, chunks) {
        var chunkMetadata = metadata[id],
            offsets = chunkMetadata.offsets,
            header = chunkMetadata.header,
            chunk,
            prop,
            subchunksLength;

        chunk = flock.audio.decode.chunkFields(dv, layout, isLittle, offsets.fields);

        for (prop in header) {
            chunk[prop] = header[prop];
        }

        if (offsets.fields + header.size > dv.offsetState) {
            offsets.data = dv.offsetState;
        }

        // Read subchunks if there are any.
        if (layout.chunkLayouts) {
            subchunksLength = dv.byteLength - offsets.data;
            flock.audio.decode.scanChunks(dv, subchunksLength, headerLayout, isLittle, metadata);
            flock.audio.decode.chunks(dv, headerLayout, layout.chunkLayouts, chunkIDs, metadata, isLittle, chunks);
        }

        return chunk;
    };

    flock.audio.decode.scanChunks = function (dv, l, headerLayout, isLittle, allMetadata) {
        allMetadata = allMetadata || {};

        var metadata;

        while (dv.offsetState < l) {
            metadata = flock.audio.decode.chunkHeader(dv, headerLayout, isLittle);
            allMetadata[metadata.header.id] = metadata;
            dv.offsetState += metadata.header.size;
        }

        return allMetadata;
    };

    flock.audio.decode.chunks = function (dv, headerLayout, layouts, chunkIDs, metadata, isLittle, chunks) {
        chunks = chunks || {};

        var order = layouts.order,
            i,
            id,
            type,
            layout;

        for (i = 0; i < order.length; i++) {
            id = order[i];
            type = chunkIDs[id];
            layout = layouts[id];
            chunks[type] = flock.audio.decode.chunk(dv, id, type, headerLayout, layout, chunkIDs, metadata, isLittle, chunks);
        }

        return chunks;
    };

    flock.audio.decode.chunkFields = function (dv, layout, isLittle, offset) {
        var decoded = {};

        var order = layout.order,
            fields = layout.fields,
            i,
            name,
            spec;

        dv.offsetState = typeof (offset) === "number" ? offset : dv.offsetState;

        for (i = 0; i < order.length; i++) {
            name = order[i];
            spec = fields[name];

            decoded[name] = typeof spec === "string" ? dv[spec](undefined, isLittle) :
                dv[spec.getter](spec.length, spec.width, undefined, isLittle);
        }

        return decoded;
    };

    flock.audio.decode.chunkHeader = function (dv, headerLayout, isLittle) {
        var metadata = {
            offsets: {}
        };

        metadata.offsets.start = dv.offsetState;
        metadata.header = flock.audio.decode.chunkFields(dv, headerLayout, isLittle);
        metadata.offsets.fields = dv.offsetState;

        return metadata;
    };

    flock.audio.decode.wavSampleDataType = function (chunks) {
        var t = chunks.format.audioFormatType;
        if (t !== 1 && t !== 3) {
            throw new Error("Flocking decoder error: this file contains an unrecognized WAV format type.");
        }

        return t === 1 ? "Int" : "Float";
    };

    flock.audio.decode.aiffSampleDataType = function (chunks) {
        var t = chunks.container.formatType;
        if (t !== "AIFF" && t !== "AIFC") {
            throw new Error("Flocking decoder error: this file contains an unrecognized AIFF format type.");
        }

        return t === "AIFF" ? "Int" : "Float";
    };

    flock.audio.decode.chunked = function (data, formatSpec) {
        var dv = new PolyDataView(data, 0, data.byteLength),
            isLittle = formatSpec.littleEndian,
            headerLayout = formatSpec.headerLayout,
            metadata,
            chunks,
            dataType;

        metadata = flock.audio.decode.scanChunks(dv, dv.byteLength, headerLayout, isLittle);
        chunks = flock.audio.decode.chunks(dv, headerLayout, formatSpec.chunkLayouts, formatSpec.chunkIDs, metadata, isLittle);

        // Calculate the data type for the sample data.
        dataType = formatSpec.findSampleDataType(chunks, metadata, dv);

        // Once all the chunks have been read, decode the channel data.
        flock.audio.decode.dataChunk(dv, chunks.format, dataType, chunks.data, isLittle);

        return chunks;
    };


    /************************************
     * Audio Format Decoding Strategies *
     ************************************/

    flock.audio.formats = {};

    flock.audio.formats.wav = {
        reader: flock.audio.decode.chunked,
        littleEndian: true,

        chunkIDs: {
            "RIFF": "container",
            "fmt ": "format",
            "data": "data"
        },

        headerLayout: {
            fields: {
                id: {
                    getter: "getString",
                    length: 4,
                    width: 1
                },
                size: "getUint32"
            },
            order: ["id", "size"]
        },

        chunkLayouts: {
            "RIFF": {
                fields: {
                    formatType: {
                        getter: "getString",
                        length: 4,
                        width: 1
                    }
                },

                order: ["formatType"],

                chunkLayouts: {
                    "fmt ": {
                        fields: {
                            audioFormatType: "getUint16",
                            numChannels: "getUint16",
                            sampleRate: "getUint32",
                            avgBytesPerSecond: "getUint32",
                            blockAlign: "getUint16",
                            bitRate: "getUint16"
                        },
                        order: ["audioFormatType", "numChannels", "sampleRate", "avgBytesPerSecond", "blockAlign", "bitRate"]
                    },
                    "data": {
                        fields: {},
                        order: []
                    },

                    order: ["fmt ", "data"]
                }
            },

            order: ["RIFF"]
        },

        findSampleDataType: flock.audio.decode.wavSampleDataType
    };


    flock.audio.formats.aiff = {
        reader: flock.audio.decode.chunked,
        littleEndian: false,

        chunkIDs: {
            "FORM": "container",
            "COMM": "format",
            "SSND": "data"
        },

        headerLayout: {
            fields: {
                id: {
                    getter: "getString",
                    length: 4,
                    width: 1
                },
                size: "getUint32"
            },
            order: ["id", "size"]
        },

        chunkLayouts: {
            "FORM": {
                fields: {
                    formatType: {
                        getter: "getString",
                        length: 4,
                        width: 1
                    }
                },

                order: ["formatType"],

                chunkLayouts: {
                    "COMM": {
                        fields: {
                            numChannels: "getInt16",
                            numSampleFrames: "getUint32",
                            bitRate: "getUint16",
                            sampleRate: "getFloat80"

                        },
                        order: ["numChannels", "numSampleFrames", "bitRate", "sampleRate"]
                    },

                    "SSND": {
                        fields: {
                            offset: "getUint32",
                            blockSize: "getUint32"
                        },
                        order: ["offset", "blockSize"]
                    },

                    order: ["COMM", "SSND"]
                }
            },

            order: ["FORM"]
        },

        findSampleDataType: flock.audio.decode.aiffSampleDataType
    };

}());
;/*
* Flocking Scheduler
* http://github.com/colinbdclark/flocking
*
* Copyright 2013-2014, Colin Clark
* Dual licensed under the MIT and GPL Version 2 licenses.
*/

/*global require, self*/
/*jshint white: false, newcap: true, regexp: true, browser: true,
    forin: false, nomen: true, bitwise: false, maxerr: 100,
    indent: 4, plusplus: false, curly: true, eqeqeq: true,
    freeze: true, latedef: true, noarg: true, nonew: true, quotmark: double, undef: true,
    unused: true, strict: true, asi: false, boss: false, evil: false, expr: false,
    funcscope: false*/

var fluid = fluid || require("infusion"),
    flock = fluid.registerNamespace("flock");

(function () {
    "use strict";

    // TODO: This duplicates code in flocking-core and should be factored differently.
    flock.shim = {
        URL: typeof window !== "undefined" ? window.URL || window.webkitURL || window.msURL : undefined
    };

    flock.worker = function (code) {
        var type = typeof code,
            url,
            blob;

        if (type === "function") {
            code = "(" + code.toString() + ")();";
        } else if (type !== "string") {
            throw new Error("A flock.worker must be initialized with a String or a Function.");
        }

        if (window.Blob) {
            blob = new Blob([code], {
                type: "text/javascript"
            });
            url = flock.shim.URL.createObjectURL(blob);
        } else {
            url = "data:text/javascript;base64," + window.btoa(code);
        }
        return new Worker(url);
    };


    fluid.registerNamespace("flock.scheduler");


    /**********
     * Clocks *
     **********/

    fluid.defaults("flock.scheduler.intervalClock", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        events: {
            tick: null
        }
    });

    flock.scheduler.intervalClock.finalInit = function (that) {
        that.scheduled = {};

        that.schedule = function (interval) {
            var id = setInterval(function () {
                that.events.tick.fire(interval);
            }, interval);
            that.scheduled[interval] = id;
        };

        that.clear = function (interval) {
            var id = that.scheduled[interval];
            clearInterval(id);
            delete that.scheduled[interval];
        };

        that.clearAll = function () {
            for (var interval in that.scheduled) {
                that.clear(interval);
            }
        };

        that.end = that.clearAll;
    };


    fluid.defaults("flock.scheduler.scheduleClock", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        events: {
            tick: null
        }
    });

    flock.scheduler.scheduleClock.finalInit = function (that) {
        that.scheduled = [];

        that.schedule = function (timeFromNow) {
            var id;
            id = setTimeout(function () {
                that.clear(id);
                that.events.tick.fire(timeFromNow);
            }, timeFromNow);
            that.scheduled.push(id);
        };

        that.clear = function (id, idx) {
            idx = idx === undefined ? that.scheduled.indexOf(id) : idx;
            if (idx > -1) {
                that.scheduled.splice(idx, 1);
            }
            clearTimeout(id);
        };

        that.clearAll = function () {
            for (var i = 0; i < that.scheduled.length; i++) {
                var id = that.scheduled[i];
                clearTimeout(id);
            }
            that.scheduled.length = 0;
        };

        that.end = that.clearAll;
    };


    fluid.defaults("flock.scheduler.webWorkerClock", {
        gradeNames: ["fluid.modelComponent", "fluid.eventedComponent", "autoInit"],
        model: {
            messages: {
                schedule: {
                    msg: "schedule"
                },
                clear: {
                    msg: "clear"
                },
                clearAll: {
                    msg: "clearAll"
                },
                end: {
                    msg: "end"
                }
            }
        },
        events: {
            tick: null
        },
        clockType: "intervalClock"
    });

    flock.scheduler.webWorkerClock.finalInit = function (that) {
        that.worker = new flock.worker(flock.scheduler.webWorkerClock.workerImpl);

        // Start the worker-side clock.
        that.worker.postMessage({
            msg: "start",
            value: that.options.clockType
        });

        // Listen for tick messages from the worker and fire accordingly.
        that.worker.addEventListener("message", function (e) {
            that.events.tick.fire(e.data.value);
        }, false);

        that.postToWorker = function (msgName, value) {
            var msg = that.model.messages[msgName];
            if (value !== undefined) {
                msg.value = value;
            }
            that.worker.postMessage(msg);
        };

        that.schedule = function (time) {
            that.postToWorker("schedule", time);
        };

        that.clear = function (time) {
            that.postToWorker("clear", time);
        };

        that.clearAll = function () {
            that.postToWorker("clearAll");
        };

        that.end = function () {
            that.postToWorker("end");
        };
    };


    // This code is only intended to run from within a Worker, via flock.worker.
    flock.scheduler.webWorkerClock.workerImpl = function () {
        "use strict"; // jshint ignore:line

        var flock = flock || {};
        flock.worker = flock.worker || {};

        flock.worker.clock = function () {
            var that = {};

            that.tick = function (interval) {
                self.postMessage({
                    msg: "tick",
                    value: interval
                });
            };

            return that;
        };

        flock.worker.intervalClock = function () {
            var that = flock.worker.clock();
            that.scheduled = {};

            // TODO: Copy-pasted from flock.scheduler.intervalClock.
            that.schedule = function (interval) {
                var id = setInterval(function () {
                    that.tick(interval);
                }, interval);
                that.scheduled[interval] = id;
            };

            // TODO: Copy-pasted from flock.scheduler.intervalClock.
            that.clear = function (interval) {
                var id = that.scheduled[interval];
                clearInterval(id);
                delete that.scheduled[interval];
            };

            // TODO: Copy-pasted from flock.scheduler.intervalClock.
            that.clearAll = function () {
                for (var interval in that.scheduled) {
                    that.clear(interval);
                }
            };

            return that;
        };

        flock.worker.scheduleClock = function () {
            var that = flock.worker.clock();
            that.scheduled = [];

            // TODO: Copy-pasted from flock.scheduler.scheduleClock.
            that.schedule = function (timeFromNow) {
                var id;
                id = setTimeout(function () {
                    that.clear(id);
                    that.tick(timeFromNow);
                }, timeFromNow);
                that.scheduled.push(id);
            };

            // TODO: Copy-pasted from flock.scheduler.scheduleClock.
            that.clear = function (id, idx) {
                idx = idx === undefined ? that.scheduled.indexOf(id) : idx;
                if (idx > -1) {
                    that.scheduled.splice(idx, 1);
                }
                clearTimeout(id);
            };

            // TODO: Copy-pasted from flock.scheduler.scheduleClock.
            that.clearAll = function () {
                for (var i = 0; i < that.scheduled.length; i++) {
                    var id = that.scheduled[i];
                    clearTimeout(id);
                }
                that.scheduled.length = 0;
            };

            return that;
        };

        self.addEventListener("message", function (e) {
            if (e.data.msg === "start") {
                flock.clock = flock.worker[e.data.value]();
            } else if (e.data.msg === "end") {
                if (flock.clock) {
                    flock.clock.clearAll();
                    self.close();
                }
            } else if (flock.clock) {
                flock.clock[e.data.msg](e.data.value);
            }
        }, false);
    };

    fluid.defaults("flock.scheduler.webWorkerIntervalClock", {
        gradeNames: ["flock.scheduler.webWorkerClock", "autoInit"],
        clockType: "intervalClock"
    });

    fluid.defaults("flock.scheduler.webWorkerScheduleClock", {
        gradeNames: ["flock.scheduler.webWorkerClock", "autoInit"],
        clockType: "scheduleClock"
    });


    /**************
     * Schedulers *
     **************/

    flock.scheduler.makeOneShotValueListener = function (value, fn, removeFn) {
        var listener = function (time) {
            if (time === value) {
                fn(time);
                removeFn(listener);
            }
        };

        return listener;
    };

    flock.scheduler.makeRepeatingValueListener = function (value, fn) {
        return function (time) {
            if (time === value) {
                fn(time);
            }
        };
    };


    fluid.defaults("flock.scheduler.async", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],
        components: {
            timeConverter: {
                type: "flock.convert.seconds"
            },
            intervalClock: {
                type: "flock.scheduler.webWorkerIntervalClock"
            },
            scheduleClock: {
                type: "flock.scheduler.webWorkerScheduleClock"
            }
        }
    });

    // TODO: Duplication!
    flock.scheduler.async.finalInit = function (that) {
        that.intervalListeners = {};
        that.scheduleListeners = [];

        that.addIntervalListener = function (interval, fn) {
            var listener = flock.scheduler.makeRepeatingValueListener(interval, fn);
            listener.wrappedListener = fn;
            that.intervalListeners[interval] = that.intervalListeners[interval] || [];
            that.intervalListeners[interval].push(listener);
            that.intervalClock.events.tick.addListener(listener);

            return listener;
        };

        that.addScheduleListener = function (time, fn) {
            var listener = flock.scheduler.makeOneShotValueListener(time, fn, that.clear);
            listener.wrappedListener = fn;
            that.scheduleListeners.push(listener);
            that.scheduleClock.events.tick.addListener(listener);

            return listener;
        };

        that.scheduleChange = function (time, changeSpec, addListenerFn, clock) {
            var ms = that.timeConverter.value(time),
                fn = flock.scheduler.async.prepareSchedulerFn(changeSpec, that.events),
                listener = addListenerFn(ms, fn);

            clock.schedule(ms);
            return listener;
        };

        that.repeat = function (interval, changeSpec) {
            return that.scheduleChange(interval, changeSpec, that.addIntervalListener, that.intervalClock);
        };

        that.once = function (time, changeSpec) {
            return that.scheduleChange(time, changeSpec, that.addScheduleListener, that.scheduleClock);
        };

        that.sequence = function (times, changeSpec) {
            var listeners = [],
                listener;

            for (var i = 0; i < times.length; i++) {
                listener = that.once(times[i], changeSpec);
                listeners.push(listener);
            }

            return listeners;
        };

        that.schedule = function (schedules) {
            schedules = flock.isIterable(schedules) ? schedules : [schedules];

            var i,
                schedule;

            for (i = 0; i < schedules.length; i++) {
                schedule = schedules[i];
                flock.invoke(that, schedule.interval, [schedule.time, schedule.change]);
            }
        };

        that.clear = function (listener) {
            if (!listener) {
                return;
            }

            // TODO: Rather inefficient.
            var idx = that.scheduleListeners.indexOf(listener),
                interval;
            if (idx > -1) {
                that.scheduleClock.events.tick.removeListener(listener);
                that.scheduleListeners.splice(idx, 1);
                return;
            }

            that.intervalClock.events.tick.removeListener(listener);
            for (interval in that.intervalListeners) {
                idx = that.intervalListeners[interval].indexOf(listener);
                if (idx > -1) {
                    that.intervalListeners[interval].splice(idx, 1);
                }
            }
        };

        that.clearRepeat = function (interval) {
            that.intervalClock.clear(interval);

            var listeners = that.intervalListeners[interval],
                i,
                listener;

            if (!listeners) {
                return;
            }

            for (i = 0; i < listeners.length; i++) {
                listener = listeners[i];
                that.intervalClock.events.tick.removeListener(listener);
            }
            listeners.length = 0;

            return listener;
        };

        that.clearAll = function () {
            that.intervalClock.clearAll();
            for (var interval in that.intervalListeners) {
                that.clearRepeat(interval);
            }

            that.scheduleClock.clearAll();
            for (var listener in that.scheduleListeners) {
                that.clear(listener);
            }
        };

        that.end = function () {
            that.intervalClock.end();
            that.scheduleClock.end();
        };

        if (that.options.score) {
            that.schedule(that.options.score);
        }
    };

    flock.scheduler.async.prepareSchedulerFn = function (changeSpec, events) {
        var type = typeof changeSpec,
            fn;

        if (type === "function") {
            // The user has scheduled a raw function pointer.
            fn = changeSpec;
        } else if (type === "string") {
            // An event was scheduled by name.
            fn = events[changeSpec].fire;
        } else {
            // A change spec object was scheduled.
            fn = flock.scheduler.async.evaluateChangeSpec(changeSpec);
        }

        return fn;
    };

    flock.scheduler.async.evaluateChangeSpec = function (changeSpec) {
        var synths = {},
            staticChanges = {};

        // Find all synthDefs and create demand rate synths for them.
        for (var path in changeSpec.values) {
            var change = changeSpec.values[path];
            if (change.synthDef) {
                synths[path] = flock.synth.value(change);
            } else {
                staticChanges[path] = change;
            }
        }

        // Create a scheduler listener that evaluates the changeSpec and updates the synth.
        return function () {
            for (var path in synths) {
                var synth = synths[path];
                staticChanges[path] = synth.value();
            }

            // TODO: Hardcoded to the shared environment.
            var targetSynth = typeof changeSpec.synth === "string" ?
                flock.enviro.shared.namedNodes[changeSpec.synth] : changeSpec.synth;
            targetSynth.set(staticChanges);
        };
    };

    fluid.defaults("flock.scheduler.async.tempo", {
        gradeNames: ["flock.scheduler.async", "autoInit"],

        bpm: 60,

        components: {
            timeConverter: {
                type: "flock.convert.beats",
                options: {
                    bpm: "{tempo}.options.bpm"
                }
            }
        }
    });


    /*******************
     * Time Conversion *
     *******************/

    fluid.registerNamespace("flock.convert");

    flock.convert.makeStatelessConverter = function (convertFn) {
        return function () {
            return {
                value: convertFn
            };
        };
    };

    flock.convert.ms = flock.convert.makeStatelessConverter(fluid.identity);

    flock.convert.seconds = flock.convert.makeStatelessConverter(function (secs) {
        return secs * 1000;
    });

    fluid.defaults("flock.convert.beats", {
        gradeNames: ["fluid.littleComponent", "autoInit"],
        bpm: 60
    });

    flock.convert.beats.finalInit = function (that) {
        that.value = function (beats) {
            var bpm = that.options.bpm;
            return bpm <= 0 ? 0 : (beats / bpm) * 60000;
        };
    };
}());
;/*
* Flocking WebAudio Strategy
* http://github.com/colinbdclark/flocking
*
* Copyright 2013-2014, Colin Clark
* Dual licensed under the MIT and GPL Version 2 licenses.
*/

/*global require*/
/*jshint white: false, newcap: true, regexp: true, browser: true,
    forin: false, nomen: true, bitwise: false, maxerr: 100,
    indent: 4, plusplus: false, curly: true, eqeqeq: true,
    freeze: true, latedef: true, noarg: true, nonew: true, quotmark: double, undef: true,
    unused: true, strict: true, asi: false, boss: false, evil: false, expr: false,
    funcscope: false*/

var fluid = fluid || require("infusion"),
    flock = fluid.registerNamespace("flock");

(function () {
    "use strict";

    flock.shim.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia;

    /**
     * Web Audio API Audio Strategy
     */
    fluid.defaults("flock.enviro.webAudio", {
        gradeNames: ["flock.enviro.audioStrategy", "autoInit"],

        members: {
            preNode: null,
            jsNode: null,
            postNode: null
        },

        model: {
            isGenerating: false,
            hasInput: false
        }
    });

    flock.enviro.webAudio.finalInit = function (that) {

        that.startGeneratingSamples = function () {
            var m = that.model;

            if (that.preNode) {
                that.preNode.connect(that.jsNode);
            }

            that.postNode.connect(that.context.destination);
            if (that.postNode !== that.jsNode) {
                that.jsNode.connect(that.postNode);
            }

            // Work around a bug in iOS Safari where it now requires a noteOn()
            // message to be invoked before sound will work at all. Just connecting a
            // ScriptProcessorNode inside a user event handler isn't sufficient.
            if (m.shouldInitIOS) {
                var s = that.context.createBufferSource();
                s.connect(that.jsNode);
                s.start(0);
                s.stop(0);
                s.disconnect(0);
                m.shouldInitIOS = false;
            }

            m.isGenerating = true;
        };

        that.stopGeneratingSamples = function () {
            that.jsNode.disconnect(0);
            that.postNode.disconnect(0);
            if (that.preNode) {
                that.preNode.disconnect(0);
            }

            that.model.isGenerating = false;
        };

        that.writeSamples = function (e) {
            var m = that.model,
                hasInput = m.hasInput,
                krPeriods = m.krPeriods,
                evaluator = that.nodeEvaluator,
                buses = evaluator.buses,
                audioSettings = that.options.audioSettings,
                blockSize = audioSettings.blockSize,
                playState = m.playState,
                chans = audioSettings.chans,
                inBufs = e.inputBuffer,
                inChans = e.inputBuffer.numberOfChannels,
                outBufs = e.outputBuffer,
                chan,
                i,
                samp;

            // If there are no nodes providing samples, write out silence.
            if (evaluator.nodes.length < 1) {
                for (chan = 0; chan < chans; chan++) {
                    flock.generate.silence(outBufs.getChannelData(chan));
                }
                return;
            }

            // TODO: Make a formal distinction between input buses,
            // output buses, and interconnect buses in the environment!
            for (i = 0; i < krPeriods; i++) {
                var offset = i * blockSize;

                evaluator.clearBuses();

                // Read this ScriptProcessorNode's input buffers
                // into the environment.
                if (hasInput) {
                    for (chan = 0; chan < inChans; chan++) {
                        var inBuf = inBufs.getChannelData(chan),
                            inBusNumber = chans + chan, // Input buses are located after output buses.
                            targetBuf = buses[inBusNumber];

                        for (samp = 0; samp < blockSize; samp++) {
                            targetBuf[samp] = inBuf[samp + offset];
                        }
                    }
                }

                evaluator.gen();

                // Output the environment's signal
                // to this ScriptProcessorNode's output channels.
                for (chan = 0; chan < chans; chan++) {
                    var sourceBuf = buses[chan],
                        outBuf = outBufs.getChannelData(chan);

                    // And output each sample.
                    for (samp = 0; samp < blockSize; samp++) {
                        outBuf[samp + offset] = sourceBuf[samp];
                    }
                }
            }

            playState.written += audioSettings.bufferSize * chans;
            if (playState.written >= playState.total) {
                that.stop();
            }
        };

        that.insertInputNode = function (node) {
            var m = that.model;

            if (that.preNode) {
                that.removeInputNode(that.preNode);
            }

            that.preNode = node;
            m.hasInput = true;

            if (m.isGenerating) {
                that.preNode.connect(that.jsNode);
            }
        };

        that.insertOutputNode = function (node) {
            if (that.postNode) {
                that.removeOutputNode(that.postNode);
            }

            that.postNode = node;
        };

        that.removeInputNode = function () {
            flock.enviro.webAudio.removeNode(that.preNode);
            that.preNode = null;
            that.model.hasInput = false;
        };

        that.removeOutputNode = function () {
            flock.enviro.webAudio.removeNode(that.postNode);
            that.postNode = that.jsNode;
        };

        that.startReadingAudioInput = function () {
            flock.shim.getUserMedia.call(navigator, {
                audio: true
            },
            function success (mediaStream) {
                var mic = that.context.createMediaStreamSource(mediaStream);
                that.insertInputNode(mic);
            },
            function error (err) {
                fluid.log(fluid.logLevel.IMPORTANT,
                    "An error occurred while trying to access the user's microphone. " +
                    err);
            });
        };

        that.stopReadingAudioInput = function () {
            that.removeInputNode();
        };

        that.init = function () {
            var m = that.model,
                settings = that.options.audioSettings;

            m.krPeriods = settings.bufferSize / settings.blockSize;

            // Singleton AudioContext since the WebKit implementation
            // freaks if we try to instantiate a new one.
            if (!flock.enviro.webAudio.audioContext) {
                flock.enviro.webAudio.audioContext = new flock.enviro.webAudio.contextConstructor();
            }

            that.context = flock.enviro.webAudio.audioContext;
            // Override audio settings based on the capabilities of the environment.
            // These values are "pulled" by the enviro in a hacky sort of way.
            settings.rates.audio = that.context.sampleRate;

            // TODO: This reduces the user's ability to easily control how many
            // channels of their device are actually used. They can control
            // how many non-silent channels there are by using the "expand"
            // input of flock.ugen.output, but there will still be some extra
            // overhead. The best way to solve this is to not override settings.chans,
            // but to instead offer some kind of controls in the playground for adjusting this,
            // or by providing some kind of "max channels" flag as a parameter to chans.

            if (!flock.platform.browser.safari) {
                // TODO: Fix this temporary workaround for the fact that iOS won't
                // allow us to access the destination node until the user has
                // touched something.
                settings.chans = that.context.destination.maxChannelCount;
                that.context.destination.channelCount = settings.chans;
            }

            that.jsNode = flock.enviro.webAudio.createScriptNode(that.context, settings);
            that.insertOutputNode(that.jsNode);
            that.jsNode.onaudioprocess = that.writeSamples;

            m.shouldInitIOS = flock.platform.isIOS;
        };

        that.init();
    };

    flock.enviro.webAudio.createScriptNode = function (context, settings) {
        // Create the script processor and setup the audio context's
        // destination to the appropriate number of channels.
        var creatorName = context.createScriptProcessor ?
            "createScriptProcessor" : "createJavaScriptNode";

        var jsNode = context[creatorName](settings.bufferSize, settings.chans, settings.chans);
        jsNode.channelCountMode = "explicit";
        jsNode.channelCount = settings.chans;

        return jsNode;
    };

    flock.enviro.webAudio.removeNode = function (node) {
        node.disconnect(0);
    };

    flock.enviro.webAudio.contextConstructor = window.AudioContext || window.webkitAudioContext;

    fluid.demands("flock.enviro.audioStrategy", "flock.platform.webAudio", {
        funcName: "flock.enviro.webAudio"
    });

}());
;/*
* Flocking Unit Generators
* http://github.com/colinbdclark/flocking
*
* Copyright 2011-2014, Colin Clark
* Dual licensed under the MIT and GPL Version 2 licenses.
*/

/*global require, Float32Array, Random*/
/*jshint white: false, newcap: true, regexp: true, browser: true,
    forin: false, nomen: true, bitwise: false, maxerr: 100,
    indent: 4, plusplus: false, curly: true, eqeqeq: true,
    freeze: true, latedef: true, noarg: true, nonew: true, quotmark: double, undef: true,
    unused: true, strict: true, asi: false, boss: false, evil: false, expr: false,
    funcscope: false*/

var fluid = fluid || require("infusion"),
    flock = fluid.registerNamespace("flock");

(function () {
    "use strict";

    var $ = fluid.registerNamespace("jQuery"),
        DSP = flock.requireModule("DSP", "dspapi"),
        Filter = flock.requireModule("Filter", "dspapi");

    /*************
     * Utilities *
     *************/

    // TODO: Check API; write unit tests.
    flock.aliasUGen = function (sourcePath, aliasName, inputDefaults, defaultOptions) {
        var root = flock.get(sourcePath);
        flock.set(root, aliasName, function (inputs, output, options) {
            options = $.extend(true, {}, defaultOptions, options);
            return root(inputs, output, options);
        });
        fluid.defaults(sourcePath + "." + aliasName, inputDefaults);
    };

    // TODO: Check API; write unit tests.
    flock.aliasUGens = function (sourcePath, aliasesSpec) {
        var aliasName,
            settings;

        for (aliasName in aliasesSpec) {
            settings = aliasesSpec[aliasName];
            flock.aliasUGen(sourcePath, aliasName, {inputs: settings.inputDefaults}, settings.options);
        }
    };

    flock.krMul = function (numSamps, output, mulInput) {
        var mul = mulInput.output[0],
            i;
        for (i = 0; i < numSamps; i++) {
            output[i] = output[i] * mul;
        }
    };

    flock.mul = function (numSamps, output, mulInput) {
        var mul = mulInput.output,
            i;
        for (i = 0; i < numSamps; i++) {
            output[i] = output[i] * mul[i];
        }
    };

    flock.krAdd = function (numSamps, output, mulInput, addInput) {
        var add = addInput.output[0],
            i;
        for (i = 0; i < numSamps; i++) {
            output[i] = output[i] + add;
        }
    };

    flock.add = function (numSamps, output, mulInput, addInput) {
        var add = addInput.output,
            i;
        for (i = 0; i < numSamps; i++) {
            output[i] = output[i] + add[i];
        }
    };

    flock.krMulAdd = function (numSamps, output, mulInput, addInput) {
        var mul = mulInput.output[0],
            add = addInput.output,
            i;
        for (i = 0; i < numSamps; i++) {
            output[i] = output[i] * mul + add[i];
        }
    };

    flock.mulKrAdd = function (numSamps, output, mulInput, addInput) {
        var mul = mulInput.output,
            add = addInput.output[0],
            i;
        for (i = 0; i < numSamps; i++) {
            output[i] = output[i] * mul[i] + add;
        }
    };

    flock.krMulKrAdd = function (numSamps, output, mulInput, addInput) {
        var mul = mulInput.output[0],
            add = addInput.output[0],
            i;
        for (i = 0; i < numSamps; i++) {
            output[i] = output[i] * mul + add;
        }
    };

    flock.mulAdd = function (numSamps, output, mulInput, addInput) {
        var mul = mulInput.output,
            add = addInput.output,
            i;
        for (i = 0; i < numSamps; i++) {
            output[i] = output[i] * mul[i] + add[i];
        }
    };

    flock.onMulAddInputChanged = function (that) {
        var mul = that.inputs.mul,
            add = that.inputs.add,
            fn;

        // If we have no mul or add inputs, bail immediately.
        if (!mul && !add) {
            that.mulAdd = fluid.identity;
            return;
        }

        if (!mul) { // Only add.
            fn = add.rate !== flock.rates.AUDIO ? flock.krAdd : flock.add;
        } else if (!add) { // Only mul.
            fn = mul.rate !== flock.rates.AUDIO ? flock.krMul : flock.mul;
        } else { // Both mul and add.
            fn = mul.rate !== flock.rates.AUDIO ?
                (add.rate !== flock.rates.AUDIO ? flock.krMulKrAdd : flock.krMulAdd) :
                (add.rate !== flock.rates.AUDIO ? flock.mulKrAdd : flock.mulAdd);
        }

        that.mulAdd = function (numSamps) {
            fn(numSamps, that.output, mul, add);
        };
    };

    /*******************
     * Unit Generators *
     *******************/

    flock.ugen = function (inputs, output, options) {
        options = options || {};

        var that = {
            rate: options.rate || flock.rates.AUDIO,
            inputs: inputs,
            output: output,
            options: options,
            model: options.model || {},
            multiInputs: {},
            tags: ["flock.ugen"]
        };

        that.get = function (path) {
            return flock.input.get(that.inputs, path);
        };

        /**
         * Sets the value of the input at the specified path.
         *
         * @param {String} path the inputs's path relative to this ugen
         * @param {Number || UGenDef} val a scalar value (for Value ugens) or a UGenDef object
         * @return {UGen} the newly-created UGen that was set at the specified path
         */
        that.set = function (path, val) {
            return flock.input.set(that.inputs, path, val, that, function (ugenDef) {
                if (ugenDef === null || ugenDef === undefined) {
                    return;
                }

                return flock.parse.ugenDef(ugenDef, {
                    audioSettings: that.options.audioSettings,
                    buses: that.options.audioSettings.buses,
                    buffers: that.options.audioSettings.buffers
                });
            });
        };

        /**
         * Gets or sets the named unit generator input.
         *
         * @param {String} path the input path
         * @param {UGenDef} val [optional] a scalar value, ugenDef, or array of ugenDefs that will be assigned to the specified input name
         * @return {Number|UGen} a scalar value in the case of a value ugen, otherwise the ugen itself
         */
        that.input = function (path, val) {
            return !path ? undefined : typeof (path) === "string" ?
                arguments.length < 2 ? that.get(path) : that.set(path, val) :
                flock.isIterable(path) ? that.get(path) : that.set(path, val);
        };

        // TODO: Move this into a grade.
        that.calculateStrides = function () {
            var m = that.model,
                strideNames = that.options.strideInputs,
                inputs = that.inputs,
                i,
                name;

            m.strides = m.strides || {};

            if (!strideNames) {
                return;
            }

            for (i = 0; i < strideNames.length; i++) {
                name = strideNames[i];
                m.strides[name] = inputs[name].rate === flock.rates.AUDIO ? 1 : 0;
            }
        };

        that.collectMultiInputs = function () {
            var multiInputNames = that.options.multiInputNames,
                multiInputs = that.multiInputs,
                i,
                inputName,
                inputChannelCache,
                input;

            for (i = 0; i < multiInputNames.length; i++) {
                inputName = multiInputNames[i];
                inputChannelCache = multiInputs[inputName];

                if (!inputChannelCache) {
                    inputChannelCache = multiInputs[inputName] = [];
                } else {
                    // Clear the current array of buffers.
                    inputChannelCache.length = 0;
                }

                input = that.inputs[inputName];
                flock.ugen.collectMultiInputs(input, inputChannelCache);
            }
        };

        // Base onInputChanged() implementation.
        that.onInputChanged = function (inputName) {
            var multiInputNames = that.options.multiInputNames;

            flock.onMulAddInputChanged(that);
            if (that.options.strideInputs) {
                that.calculateStrides();
            }

            if (multiInputNames && (!inputName || multiInputNames.indexOf(inputName))) {
                that.collectMultiInputs();
            }
        };

        that.init = function () {
            var tags = fluid.makeArray(that.options.tags),
                m = that.model,
                o = that.options,
                i,
                s,
                valueDef;

            for (i = 0; i < tags.length; i++) {
                that.tags.push(tags[i]);
            }

            s = o.audioSettings = o.audioSettings || flock.enviro.shared.audioSettings;
            m.sampleRate = o.sampleRate || s.rates[that.rate];
            m.nyquistRate = m.sampleRate;
            m.blockSize = that.rate === flock.rates.AUDIO ? s.blockSize : 1;
            m.sampleDur = 1.0 / m.sampleRate;

            // Assigns an interpolator function to the UGen.
            // This is inactive by default, but can be used in custom gen() functions.
            // Will be undefined if no interpolation default or option has been set,
            // or if it is set to "none"--make sure you check before invoking it.
            that.interpolate = flock.interpolate[o.interpolation];

            if (that.rate === flock.rates.DEMAND && that.inputs.freq) {
                valueDef = flock.parse.ugenDefForConstantValue(1.0);
                that.inputs.freq = flock.parse.ugenDef(valueDef);
            }
        };

        that.init();
        return that;
    };

    // The term "multi input" is a bit ambiguous,
    // but it provides a very light (and possibly poor) abstraction for two different cases:
    //   1. inputs that consist of an array of multiple unit generators
    //   2. inputs that consist of a single unit generator that has multiple ouput channels
    // In either case, each channel of each input unit generator will be gathered up into
    // an array of "proxy ugen" objects and keyed by the input name, making easy to iterate
    // over sources of input quickly.
    // A proxy ugen consists of a simple object conforming to this contract:
    //   {rate: <rate of parent ugen>, output: <Float32Array>}
    flock.ugen.collectMultiInputs = function (inputs, inputChannelCache) {
        if (!flock.isIterable(inputs)) {
            inputs = inputs = fluid.makeArray(inputs);
        }

        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            flock.ugen.collectChannelsForInput(input, inputChannelCache);
        }

        return inputChannelCache;
    };

    flock.ugen.collectChannelsForInput = function (input, inputChannelCache) {
        var isMulti = flock.hasTag(input, "flock.ugen.multiChannelOutput"),
            channels = isMulti ? input.output : [input.output],
            i;

        for (i = 0; i < channels.length; i++) {
            inputChannelCache.push({
                rate: input.rate,
                output: channels[i]
            });
        }

        return inputChannelCache;
    };


    flock.ugen.value = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.dynamicGen = function (numSamps) {
            var out = that.output,
                m = that.model;

            for (var i = 0; i < numSamps; i++) {
                out[i] = m.value;
            }

            that.mulAdd(numSamps);
        };

        that.onInputChanged = function () {
            var inputs = that.inputs,
                m = that.model;

            m.value = inputs.value;

            if (that.rate !== "constant") {
                that.gen = that.dynamicGen;
            } else {
                that.gen = undefined;
            }

            flock.onMulAddInputChanged(that);
            that.dynamicGen(1);
        };

        that.onInputChanged();
        return that;
    };

    fluid.defaults("flock.ugen.value", {
        rate: "control",

        inputs: {
            value: 1.0,
            mul: null,
            add: null
        },

        ugenOptions: {
            tags: ["flock.ugen.valueType"]
        }
    });


    flock.ugen.passThrough = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var source = that.inputs.source.output,
                out = that.output,
                i;

            for (i = 0; i < source.length; i++) {
                out[i] = source[i];
            }

            for (; i < numSamps; i++) {
                out[i] = 0.0;

            }

            that.mulAdd(numSamps);
        };

        that.onInputChanged();
        return that;
    };

    fluid.defaults("flock.ugen.passThrough", {
        rate: "audio",

        inputs: {
            source: null,
            mul: null,
            add: null
        }
    });

    flock.ugen.valueChangeTrigger = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                source = that.inputs.source.output,
                out = that.output,
                i,
                j,
                val;

            for (i = 0, j = 0; i < numSamps; i++, j += m.strides.source) {
                val = source[j];
                out[i] = val !== m.prevVal ? 1.0 : 0.0;
                m.prevVal = val;
            }
        };

        that.onInputChanged = function (inputName) {
            that.calculateStrides();

            if (inputName === "source") {
                // Force a trigger to be output whenever the input is changed,
                // even if it's the same value as was previously held.
                that.model.prevVal = null;
            }
        };

        that.calculateStrides();
        return that;
    };

    fluid.defaults("flock.ugen.valueChangeTrigger", {
        rate: "control",

        inputs: {
            source: 0.0
        },
        ugenOptions: {
            model: {
                prevVal: 0.0
            },

            strideInputs: ["source"]
        }
    });


    flock.ugen.inputChangeTrigger = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                source = that.inputs.source.output,
                sourceInc = m.strides.source,
                duration = that.inputs.duration.output,
                durationInc = m.strides.duration,
                prevDur = m.prevDur,
                out = that.output,
                i,
                j,
                k,
                val,
                dur;

            for (i = j = k = 0; i < numSamps; i++, j += sourceInc, k += durationInc) {
                val = source[j];
                dur = duration[k];

                if (dur !== prevDur) {
                    m.prevDur = dur;
                    m.remainingOpenSamples = val > 0 ? (dur > 0 ? m.sampleRate * dur : 1) : 0;
                }

                if (m.remainingOpenSamples > 0) {
                    out[i] = val;
                    m.remainingOpenSamples--;
                } else {
                    out[i] = 0.0;
                }
            }
        };

        that.onInputChanged = function (inputName) {
            that.calculateStrides();

            if (inputName === "source") {
                that.model.prevDur = null;
            }
        };

        that.calculateStrides();
        return that;
    };

    fluid.defaults("flock.ugen.inputChangeTrigger", {
        rate: "control",

        inputs: {
            source: 0,
            duration: 0
        },

        ugenOptions: {
            model: {
                prevDuration: 0,
                remainingOpenSamples: 0
            },

            strideInputs: ["source", "duration"]
        }
    });

    flock.ugen.triggerCallback = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                o = that.options,
                out = that.output,
                inputs = that.inputs,
                triggerInc = m.strides.trigger,
                sourceInc = m.strides.source,
                trig = inputs.trigger.output,
                source = inputs.source.output,
                cbSpec = o.callback,
                fn = cbSpec.func,
                args = cbSpec.args,
                cbThis = cbSpec.this,
                lastArgIdx = m.lastArgIdx,
                prevTrig = m.prevTrig,
                i,
                j,
                k,
                currTrig,
                sourceVal;

            for (i = j = k = 0; i < numSamps; i++, j += triggerInc, k += sourceInc) {
                currTrig = trig[j];
                sourceVal = source[k];

                if (currTrig > 0.0 && prevTrig <= 0.0 && fn) {
                    // Insert the current source value into the arguments list
                    // and then invoke the specified callback function.
                    args[lastArgIdx] = sourceVal;
                    fn.apply(cbThis, args);
                }

                out[i] = sourceVal;
                prevTrig = currTrig;
            }

            m.prevTrig = prevTrig;
        };

        that.onInputChanged = function () {
            var o = that.options,
                m = that.model,
                cbSpec = o.callback,
                funcName = cbSpec.funcName;

            if (funcName) {
                cbSpec.func = fluid.getGlobalValue(funcName);
            } else if (cbSpec.this && cbSpec.method) {
                if (typeof cbSpec.this !== "string") {
                    throw new Error("flock.ugen.triggerCallback doesn't support raw 'this' objects." +
                        "Use a global key path instead.");
                }
                cbSpec.this = typeof cbSpec.this === "string" ?
                    fluid.getGlobalValue(cbSpec.this) : cbSpec.this;
                cbSpec.func = fluid.get(cbSpec.this, cbSpec.method);
            }

            m.lastArgIdx = cbSpec.args.length;
            that.calculateStrides();
        };

        that.onInputChanged();
        return that;
    };

    fluid.defaults("flock.ugen.triggerCallback", {
        rate: "audio",
        inputs: {
            source: 0,
            trigger: 0
        },
        ugenOptions: {
            model: {
                funcName: undefined,
                lastArgIdx: 0
            },
            callback: {
                "this": undefined,
                method: undefined,
                func: undefined,
                args: []
            },
            strideInputs: ["source", "trigger"]
        }
    });

    flock.ugen.math = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);
        that.expandedSource = new Float32Array(that.options.audioSettings.blockSize);

        that.krSourceKrInputGen = function () {
            var op = that.activeInput,
                input = that.inputs[op],
                sourceBuf = flock.generate(that.expandedSource, that.inputs.source.output[0]);
            DSP[op](that.output, sourceBuf, input.output[0]);
        };

        that.krSourceArInputGen = function () {
            var op = that.activeInput,
                input = that.inputs[op],
                sourceBuf = flock.generate(that.expandedSource, that.inputs.source.output[0]);
            DSP[op](that.output, sourceBuf, input.output);
        };

        that.arSourceKrInputGen = function () {
            var op = that.activeInput,
                input = that.inputs[op],
                sourceBuf = that.inputs.source.output;
            DSP[op](that.output, sourceBuf, input.output[0]);
        };

        that.arSourceArInputGen = function () {
            var op = that.activeInput,
                input = that.inputs[op];
            DSP[op](that.output, that.inputs.source.output, input.output);
        };

        that.onInputChanged = function () {
            // Find the first input and use it. Multiple inputters, beware.
            // TODO: Support multiple operations.
            var inputs = Object.keys(that.inputs),
                i,
                input,
                isInputAudioRate;

            for (i = 0; i < inputs.length; i++) {
                input = inputs[i];
                if (input !== "source") {
                    that.activeInput = input;
                    isInputAudioRate = that.inputs[input].rate === "audio";
                    that.gen = that.inputs.source.rate === "audio" ?
                        (isInputAudioRate ? that.arSourceArInputGen : that.arSourceKrInputGen) :
                        (isInputAudioRate ? that.krSourceArInputGen : that.krSourceKrInputGen);
                    break;
                }
            }
        };

        that.init = function () {
            if (typeof (DSP) === "undefined") {
                throw new Error("DSP is undefined. Please include dspapi.js to use the flock.math unit generator.");
            }
            that.onInputChanged();
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.math", {
        rate: "audio",
        inputs: {
            // Any Web Array Math operator is supported as an input.
            source: null
        }
    });


    flock.ugen.sum = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.copyGen = function (numSamps) {
            var out = that.output,
                source = that.inputs.sources.output,
                i;

            for (i = 0; i < numSamps; i++) {
                out[i] = source[i];
            }
        };

        that.sumGen = function (numSamps) {
            var sources = that.inputs.sources,
                out = that.output,
                i,
                sourceIdx,
                sum;

            for (i = 0; i < numSamps; i++) {
                sum = 0;
                for (sourceIdx = 0; sourceIdx < sources.length; sourceIdx++) {
                    sum += sources[sourceIdx].output[i];
                }
                out[i] = sum;
            }
        };

        that.onInputChanged = function () {
            if (typeof (that.inputs.sources.length) === "number") {
                // We have an array of sources that need to be summed.
                that.gen = that.sumGen;
            } else {
                that.gen = that.copyGen;
            }
        };

        that.onInputChanged();
        return that;
    };

    fluid.defaults("flock.ugen.sum", {
        rate: "audio",
        inputs: {
            sources: null
        }
    });


    /***************
     * Oscillators *
     ***************/

    flock.ugen.osc = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                inputs = that.inputs,
                freq = inputs.freq.output,
                phaseOffset = inputs.phase.output,
                table = inputs.table,
                tableLen = m.tableLen,
                tableIncHz = m.tableIncHz,
                tableIncRad = m.tableIncRad,
                out = that.output,
                phase = m.phase,
                i,
                j,
                k,
                idx;

            for (i = 0, j = 0, k = 0; i < numSamps; i++, j += m.strides.phase, k += m.strides.freq) {
                idx = phase + phaseOffset[j] * tableIncRad;
                if (idx >= tableLen) {
                    idx -= tableLen;
                } else if (idx < 0) {
                    idx += tableLen;
                }
                out[i] = that.interpolate ? that.interpolate(idx, table) : table[idx | 0];
                phase += freq[k] * tableIncHz;
                if (phase >= tableLen) {
                    phase -= tableLen;
                } else if (phase < 0) {
                    phase += tableLen;
                }
            }

            m.phase = phase;
            that.mulAdd(numSamps);
        };

        that.onInputChanged = function () {
            flock.ugen.osc.onInputChanged(that);

            // Precalculate table-related values.
            var m = that.model;
            m.tableLen = that.inputs.table.length;
            m.tableIncHz = m.tableLen / m.sampleRate;
            m.tableIncRad =  m.tableLen / flock.TWOPI;
        };

        that.onInputChanged();
        return that;
    };

    flock.ugen.osc.onInputChanged = function (that) {
        that.calculateStrides();
        flock.onMulAddInputChanged(that);
    };

    fluid.defaults("flock.ugen.osc", {
        rate: "audio",
        inputs: {
            freq: 440.0,
            phase: 0.0,
            table: null,
            mul: null,
            add: null
        },
        ugenOptions: {
            interpolation: "linear",
            model: {
                phase: 0
            },
            strideInputs: [
                "freq",
                "phase"
            ]
        },
        tableSize: 8192
    });

    flock.ugen.osc.define = function (name, tableFillFn) {
        var lastSegIdx = name.lastIndexOf("."),
            namespace = name.substring(0, lastSegIdx),
            oscName = name.substring(lastSegIdx + 1),
            namespaceObj = flock.get(namespace);

        namespaceObj[oscName] = function (inputs, output, options) {
            // TODO: Awkward options pre-merging. Refactor osc API.
            var defaults = fluid.defaults("flock.ugen.osc"),
                merged = fluid.merge(null, defaults, options),
                s = merged.tableSize;
            inputs.table = flock.fillTable(s, tableFillFn);
            return flock.ugen.osc(inputs, output, options);
        };

        fluid.defaults(name, fluid.defaults("flock.ugen.osc"));
    };

    flock.ugen.osc.define("flock.ugen.sinOsc", flock.tableGenerators.sin);
    flock.ugen.osc.define("flock.ugen.triOsc", flock.tableGenerators.tri);
    flock.ugen.osc.define("flock.ugen.sawOsc", flock.tableGenerators.saw);
    flock.ugen.osc.define("flock.ugen.squareOsc", flock.tableGenerators.square);


    flock.ugen.sin = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                freq = that.inputs.freq.output,
                phaseOffset = that.inputs.phase.output,
                out = that.output,
                phase = m.phase,
                sampleRate = m.sampleRate,
                i,
                j,
                k;

            for (i = 0, j = 0, k = 0; i < numSamps; i++, j += m.strides.phase, k += m.strides.freq) {
                out[i] = Math.sin(phase + phaseOffset[j]);
                phase += freq[k] / sampleRate * flock.TWOPI;
            }

            m.phase = phase;
            that.mulAdd(numSamps);
        };

        that.onInputChanged = function () {
            flock.ugen.osc.onInputChanged(that);
        };

        that.onInputChanged();
        return that;
    };

    fluid.defaults("flock.ugen.sin", {
        rate: "audio",
        inputs: {
            freq: 440.0,
            phase: 0.0,
            mul: null,
            add: null
        },
        ugenOptions: {
            model: {
                phase: 0
            },
            strideInputs: [
                "freq",
                "phase"
            ]
        }
    });


    flock.ugen.lfSaw = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                freq = that.inputs.freq.output,
                out = that.output,
                scale = m.scale,
                phaseOffset = that.inputs.phase.output[0], // Phase is control rate
                phase = m.phase, // TODO: Prime synth graph on instantiation.
                i,
                j;

            for (i = 0, j = 0; i < numSamps; i++, j += m.strides.freq) {
                out[i] = phase + phaseOffset;
                phase += freq[j] * scale;
                if (phase >= 1.0) {
                    phase -= 2.0;
                } else if (phase <= -1.0) {
                    phase += 2.0;
                }
            }

            m.phase = phase;
            that.mulAdd(numSamps);
        };

        that.onInputChanged = function () {
            var m = that.model;
            m.freqInc = that.inputs.freq.rate === flock.rates.AUDIO ? 1 : 0;
            m.phase = 0.0;
            that.calculateStrides();
            flock.onMulAddInputChanged(that);
        };

        that.init = function () {
            that.model.scale = 2 * (1 / that.options.sampleRate);
            that.onInputChanged();
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.lfSaw", {
        rate: "audio",
        inputs: {
            freq: 440,
            phase: 0.0,
            mul: null,
            add: null
        },
        ugenOptions: {
            strideInputs: ["freq"]
        }
    });


    flock.ugen.lfPulse = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var inputs = that.inputs,
                m = that.model,
                freq = inputs.freq.output,
                freqInc = m.freqInc,
                width = inputs.width.output[0], // TODO: Are we handling width correctly here?
                out = that.output,
                scale = m.scale,
                phase = m.phase !== undefined ? m.phase : inputs.phase.output[0], // TODO: Unnecessary if we knew the synth graph had been primed.
                i,
                j;

            for (i = 0, j = 0; i < numSamps; i++, j += freqInc) {
                if (phase >= 1.0) {
                    phase -= 1.0;
                    out[i] = width < 0.5 ? 1.0 : -1.0;
                } else {
                    out[i] = phase < width ? 1.0 : -1.0;
                }
                phase += freq[j] * scale;
            }

            m.phase = phase;
            that.mulAdd(numSamps);
        };

        that.onInputChanged = function () {
            that.model.freqInc = that.inputs.freq.rate === flock.rates.AUDIO ? 1 : 0;
            flock.onMulAddInputChanged(that);
        };

        that.init = function () {
            that.model.scale = 1 / that.options.sampleRate;
            that.onInputChanged();
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.lfPulse", {
        rate: "audio",
        inputs: {
            freq: 440,
            phase: 0.0,
            width: 0.5,
            mul: null,
            add: null
        }
    });


    flock.ugen.impulse = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var inputs = that.inputs,
                m = that.model,
                out = that.output,
                freq = inputs.freq.output,
                freqInc = m.strides.freq,
                phaseOffset = inputs.phase.output[0],
                phase = m.phase,
                scale = m.scale,
                i,
                j,
                val;

            phase += phaseOffset;

            for (i = 0, j = 0; i < numSamps; i++, j += freqInc) {
                if (phase >= 1.0) {
                    phase -= 1.0;
                    val = 1.0;
                } else {
                    val = 0.0;
                }
                out[i] = val;
                phase += freq[j] * scale;
            }

            m.phase = phase - phaseOffset;
            that.mulAdd(numSamps);
        };

        that.onInputChanged = function () {
            that.calculateStrides();
            flock.onMulAddInputChanged(that);
        };

        that.init = function () {
            that.model.scale = 1.0 / that.model.sampleRate;
            that.onInputChanged();
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.impulse", {
        rate: "audio",
        inputs: {
            freq: 440,
            phase: 0.0,
            mul: null,
            add: null
        },
        ugenOptions: {
            model: {
                phase: 0.0
            },
            strideInputs: ["freq"]
        }
    });


    flock.ugen.t2a = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function () {
            var m = that.model,
                trig = that.inputs.source.output[0],
                offset = that.inputs.offset.output[0] | 0,
                out = that.output;

            // Clear the output buffer.
            for (var i = 0; i < out.length; i++) {
                out[i] = 0.0;
            }

            // Write the trigger value to the audio stream if it's open.
            if (trig > 0.0 && m.prevTrig <= 0.0) {
                out[offset] = trig;
            }

            m.prevTrig = trig;
        };

        return that;
    };

    fluid.defaults("flock.ugen.t2a", {
        rate: "audio",
        inputs: {
            source: null,
            offset: 0
        },
        ugenOptions: {
            model: {
                prevTrig: 0.0
            }
        }
    });


    flock.ugen.latch = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.arGen = function (numSamps) {
            var m = that.model,
                inputs = that.inputs,
                source = inputs.source.output,
                trig = inputs.trigger,
                sourceInc = m.strides.source,
                out = that.output,
                i, j,
                currTrig;

            if (m.holdVal === undefined) {
                m.holdVal = source[0];
            }

            for (i = 0, j = 0; i < numSamps; i++, j += sourceInc) {
                currTrig = trig.output[i];
                out[i] = (currTrig > 0.0 && m.prevTrig <= 0.0) ? m.holdVal = source[j] : m.holdVal;
                m.prevTrig = currTrig;
            }

            that.mulAdd(numSamps);
        };

        that.krGen = function (numSamps) {
            var m = that.model,
                currTrig = that.inputs.trigger.output[0],
                i;

            if (m.holdVal === undefined || currTrig > 0.0 && m.prevTrig <= 0.0) {
                m.holdVal = that.inputs.source.output[0];
            }
            m.prevTrig = currTrig;

            for (i = 0; i < numSamps; i++) {
                that.output[i] = m.holdVal;
            }

            that.mulAdd(numSamps);
        };

        that.onInputChanged = function () {
            that.calculateStrides();
            that.gen = that.inputs.trigger.rate === flock.rates.AUDIO ? that.arGen : that.krGen;
            flock.onMulAddInputChanged(that);
        };

        that.onInputChanged();
        return that;
    };

    fluid.defaults("flock.ugen.latch", {
        rate: "audio",
        inputs: {
            source: null,
            trigger: 0.0,
            mul: null,
            add: null
        },
        ugenOptions: {
            strideInputs: ["source"],
            model: {
                prevTrig: 0.0
            }
        }
    });


    /****************
     * Buffer UGens *
     ****************/

    /**
     * Mixes buffer-related functionality into a unit generator.
     */
    flock.ugen.buffer = function (that) {
        that.onBufferInputChanged = function (inputName) {
            var m = that.model,
                inputs = that.inputs;

            if (m.bufDef !== inputs.buffer || inputName === "buffer") {
                m.bufDef = inputs.buffer;
                flock.parse.bufferForDef(m.bufDef, that, flock.enviro.shared); // TODO: Shared enviro reference.
            }
        };

        that.setBuffer = function (bufDesc) {
            that.buffer = bufDesc;
            if (that.onBufferReady) {
                that.onBufferReady(bufDesc);
            }
        };

        that.initBuffer = function () {
            // Start with a zeroed buffer, since the buffer input may be loaded asynchronously.
            that.buffer = that.model.bufDef = flock.bufferDesc({
                format: {
                    sampleRate: that.options.audioSettings.rates.audio
                },
                data: {
                    channels: [new Float32Array(that.output.length)]
                }
            });
        };
    };


    flock.ugen.playBuffer = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        // Optimized gen function for constant regular-speed playback.
        that.crRegularSpeedGen = function (numSamps) {
            var m = that.model,
                out = that.output,
                chan = that.inputs.channel.output[0],
                source = that.buffer.data.channels[chan],
                trig = inputs.trigger.output,
                bufIdx = m.idx,
                bufLen = source.length,
                loop = that.inputs.loop.output[0],
                start = (that.inputs.start.output[0] * bufLen) | 0,
                end = (that.inputs.end.output[0] * bufLen) | 0,
                i,
                j,
                samp;

            for (i = 0, j = 0; i < numSamps; i++, j += m.strides.trigger) {
                if (trig[j] > 0.0 && m.prevTrig <= 0.0) {
                    bufIdx = start;
                } else if (bufIdx >= end) {
                    if (loop > 0) {
                        bufIdx = start;
                    } else {
                        out[i] = 0.0;
                        continue;
                    }
                }
                m.prevTrig = trig[j];

                samp = that.interpolate ? that.interpolate(bufIdx, source) : source[bufIdx | 0];
                out[i] = samp;
                bufIdx += m.stepSize;
            }

            m.idx = bufIdx;

            that.mulAdd(numSamps);
        };

        that.krSpeedGen = function (numSamps) {
            var m = that.model,
                out = that.output,
                chan = that.inputs.channel.output[0],
                speedInc = that.inputs.speed.output[0],
                source = that.buffer.data.channels[chan],
                trig = inputs.trigger.output,
                bufIdx = m.idx,
                bufLen = source.length,
                loop = that.inputs.loop.output[0],
                start = (that.inputs.start.output[0] * bufLen) | 0,
                end = (that.inputs.end.output[0] * bufLen) | 0,
                i,
                j,
                samp;

            for (i = 0, j = 0; i < numSamps; i++, j += m.strides.trigger) {
                if (trig[j] > 0.0 && m.prevTrig <= 0.0) {
                    bufIdx = start;
                } else if (bufIdx >= end) {
                    if (loop > 0) {
                        bufIdx = start;
                    } else {
                        out[i] = 0.0;
                        continue;
                    }
                }
                m.prevTrig = trig[j];

                samp = that.interpolate ? that.interpolate(bufIdx, source) : source[bufIdx | 0];
                out[i] = samp;
                bufIdx += m.stepSize * speedInc;
            }

            m.idx = bufIdx;
            that.mulAdd(numSamps);
        };

        that.onInputChanged = function (inputName) {
            var inputs = that.inputs,
                speed = inputs.speed;

            that.onBufferInputChanged(inputName);

            // TODO: Optimize for non-regular speed constant rate input.
            that.gen = (speed.rate === flock.rates.CONSTANT && speed.output[0] === 1.0) ?
                that.crRegularSpeedGen : that.krSpeedGen;

            that.calculateStrides();
            flock.onMulAddInputChanged(that);
        };

        that.onBufferReady = function () {
            var m = that.model,
                end = that.inputs.end.output[0],
                chan = that.inputs.channel.output[0],
                buf = that.buffer.data.channels[chan];

            m.idx = (end * buf.length) | 0;
            m.stepSize = that.buffer.format.sampleRate / m.sampleRate;
        };

        that.init = function () {
            flock.ugen.buffer(that);
            that.initBuffer();
            that.onInputChanged();
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.playBuffer", {
        rate: "audio",
        inputs: {
            channel: 0,
            loop: 0.0,
            speed: 1.0,
            start: 0.0,
            end: 1.0,
            trigger: 1.0,
            buffer: null,
            mul: null,
            add: null
        },
        ugenOptions: {
            model: {
                idx: 0,
                stepSize: 0,
                prevTrig: 0,
                channel: undefined
            },
            strideInputs: [
                "trigger"
            ],
            interpolation: "linear"
        }
    });

    /**
     * Reads values out of a buffer at the specified phase index.
     * This unit generator is typically used with flock.ugen.phasor or similar unit generator to
     * scan through the buffer at a particular rate.
     *
     * Inputs:
     *  - buffer: a bufDef representing the buffer to read from
     *  - channel: the channel of the buffer to read from
     *  - phase: the phase of the buffer to read (this should be a value between 0..1)
     */
    // TODO: This should be refactored based on the model of bufferPhaseStep below.
    flock.ugen.readBuffer = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                phaseS = m.strides.phase,
                out = that.output,
                chan = that.inputs.channel.output[0],
                phase = that.inputs.phase.output,
                source = that.buffer.data.channels[chan],
                sourceLen = source.length,
                i,
                bufIdx,
                j,
                val;

            for (i = j = 0; i < numSamps; i++, j += phaseS) {
                bufIdx = phase[j] * sourceLen;
                val = that.interpolate ? that.interpolate(bufIdx, source) : source[bufIdx | 0];
                out[i] = val;
            }

            that.mulAdd(numSamps);
        };

        that.onInputChanged = function (inputName) {
            that.onBufferInputChanged(inputName);
            that.calculateStrides();
            flock.onMulAddInputChanged(that);
        };

        that.init = function () {
            flock.ugen.buffer(that);
            that.initBuffer();
            that.onInputChanged();
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.readBuffer", {
        rate: "audio",

        inputs: {
            buffer: null,
            channel: 0,
            phase: 0,
            mul: null,
            add: null
        },

        ugenOptions: {
            model: {
                channel: undefined
            },
            strideInputs: [
                "phase"
            ],
            interpolation: "linear"
        }
    });

    /**
     * Outputs the duration of the specified buffer. Runs at either constant or control rate.
     * Use control rate only when the underlying buffer may change dynamically.
     *
     * Inputs:
     *  buffer: a bufDef object specifying the buffer to track
     */
    flock.ugen.bufferDuration = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.krGen = function (numSamps) {
            var m = that.model,
                chan = that.inputs.channel.output[0],
                source = that.buffer.data.channels[chan],
                rate = that.buffer.format.sampleRate,
                i;

            for (i = 0; i < numSamps; i++) {
                that.output[i] = m.value = source.length / rate;
            }
        };

        that.onInputChanged = function (inputName) {
            that.onBufferInputChanged(inputName);
        };

        that.onBufferReady = function (buffer) {
            var chan = that.inputs.channel.output[0];
            that.output[0] = that.model.value = buffer.data.channels[chan].length / that.buffer.format.sampleRate;
        };

        that.init = function () {
            var r = that.rate;
            that.gen = (r === flock.rates.CONTROL || r === flock.rates.AUDIO) ? that.krGen : undefined;
            that.output[0] = that.model.value = 0.0;
            flock.ugen.buffer(that);
            that.initBuffer();
            that.onInputChanged();
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.bufferDuration", {
        rate: "constant",
        inputs: {
            buffer: null,
            channel: 0
        },
        ugenOptions: {
            model: {
                value: 0.0
            }
        }
    });

    /**
     * Outputs the length of the specified buffer in samples. Runs at either constant or control rate.
     * Use control rate only when the underlying buffer may change dynamically.
     *
     * Inputs:
     *  buffer: a bufDef object specifying the buffer to track
     */
    flock.ugen.bufferLength = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.krGen = function (numSamps) {
            var m = that.model,
                chan = that.inputs.channel.output[0],
                source = that.buffer.data.channels[chan],
                i;

            for (i = 0; i < numSamps; i++) {
                that.output[i] = m.value = source.length;
            }
        };

        that.onInputChanged = function (inputName) {
            that.onBufferInputChanged(inputName);
        };

        that.onBufferReady = function (buffer) {
            var chan = that.inputs.channel.output[0];
            that.output[0] = that.model.value = buffer.data.channels[chan].length;
        };

        that.init = function () {
            var r = that.rate;
            that.gen = (r === flock.rates.CONTROL || r === flock.rates.AUDIO) ? that.krGen : undefined;
            that.output[0] = that.model.value = 0.0;
            flock.ugen.buffer(that);
            that.initBuffer();
            that.onInputChanged();
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.bufferLength", {
        rate: "constant",
        inputs: {
            buffer: null,
            channel: 0
        },
        ugenOptions: {
            model: {
                value: 0.0
            }
        }
    });

    /**
     * Outputs a phase step value for playing the specified buffer at its normal playback rate.
     * This unit generator takes into account any differences betwee the sound file's sample rate and
     * the environment's audio rate.
     *
     * Inputs:
     *  buffer: a bufDef object specifying the buffer to track
     */
    flock.ugen.bufferPhaseStep = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.krGen = function (numSamps) {
            var out = that.output,
                val = that.model.value,
                i;

            for (i = 0; i < numSamps; i++) {
                out[i] = val;
            }

            that.mulAdd(numSamps);
        };

        that.onInputChanged = function (inputName) {
            that.onBufferInputChanged(inputName);
            flock.onMulAddInputChanged(that);
        };

        that.onBufferReady = function (buffer) {
            var m = that.model,
                chan = that.inputs.channel.output[0],
                source = buffer.data.channels[chan],
                enviroRate = that.options.audioSettings.rates.audio,
                bufferRate = that.buffer.format.sampleRate || enviroRate;

            m.scale = bufferRate / enviroRate;
            that.output[0] = m.value = 1 / (source.length * m.scale);
        };

        that.init = function () {
            var r = that.rate;
            that.gen = (r === flock.rates.CONTROL || r === flock.rates.AUDIO) ? that.krGen : undefined;
            that.output[0] = that.model.value = 0.0;
            flock.ugen.buffer(that);
            that.initBuffer();
            that.onInputChanged();
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.bufferPhaseStep", {
        rate: "constant",
        inputs: {
            buffer: null,
            channel: 0
        },
        ugenOptions: {
            model: {
                scale: 1,
                value: 0
            }
        }
    });

    /**
     * Constant-rate unit generator that outputs the environment's current audio sample rate.
     */
    flock.ugen.sampleRate = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);
        that.output[0] = that.options.audioSettings.rates.audio;
        return that;
    };

    fluid.defaults("flock.ugen.sampleRate", {
        rate: "constant",
        inputs: {}
    });


    /*********
     * Noise *
     *********/

    flock.ugen.dust = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                density = inputs.density.output[0], // Density is kr.
                threshold,
                scale,
                val,
                i;

            if (density !== m.density) {
                m.density = density;
                threshold = m.threshold = density * m.sampleDur;
                scale = m.scale = threshold > 0.0 ? 1.0 / threshold : 0.0;
            } else {
                threshold = m.threshold;
                scale = m.scale;
            }

            for (i = 0; i < numSamps; i++) {
                val = Math.random();
                output[i] = (val < threshold) ? val * scale : 0.0;
            }

            that.mulAdd(numSamps);
        };

        that.onInputChanged();
        return that;
    };

    fluid.defaults("flock.ugen.dust", {
        rate: "audio",
        inputs: {
            density: 1.0,
            mul: null,
            add: null
        },
        ugenOptions: {
            model: {
                density: 0.0,
                scale: 0.0,
                threshold: 0.0
            }
        }
    });


    flock.ugen.whiteNoise = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var out = that.output,
                i;

            for (i = 0; i < numSamps; i++) {
                out[i] = Math.random();
            }

            that.mulAdd(numSamps);
        };

        that.onInputChanged();
        return that;
    };

    fluid.defaults("flock.ugen.whiteNoise", {
        rate: "audio",
        inputs: {
            mul: null,
            add: null
        }
    });


    /**
     * Implements Larry Tramiel's first Pink Noise algorithm
     * described at http://home.earthlink.net/~ltrammell/tech/pinkalg.htm,
     * based on a version by David Lowenfels posted to musicdsp:
     * http://www.musicdsp.org/showone.php?id=220.
     */
    flock.ugen.pinkNoise = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var state = that.model.state,
                a = that.a,
                p = that.p,
                offset = that.model.offset,
                out = that.output,
                i,
                j,
                rand,
                val;

            for (i = 0; i < numSamps; i++) {
                val = 0;
                for (j = 0; j < state.length; j++) {
                    rand = Math.random();
                    state[j] = p[j] * (state[j] - rand) + rand;
                    val += a[j] * state[j];
                }
                out[i] = val * 2 - offset;
            }

            that.mulAdd(numSamps);
        };

        that.init = function () {
            that.a = new Float32Array(that.options.coeffs.a);
            that.p = new Float32Array(that.options.coeffs.p);
            that.model.state = new Float32Array(that.a.length);

            for (var i = 0; i < that.a.length; i++) {
                that.model.offset += that.a[i];
            }

            that.onInputChanged();
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.pinkNoise", {
        rate: "audio",
        inputs: {
            mul: null,
            add: null
        },
        ugenOptions: {
            model: {
                offset: 0
            },
            coeffs: {
                a: [0.02109238, 0.07113478, 0.68873558],
                p: [0.3190, 0.7756, 0.9613]
            }
        }
    });

    flock.ugen.lfNoise = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                freq = inputs.freq.output[0], // Freq is kr.
                remain = numSamps,
                out = that.output,
                currSamp = 0,
                sampsForLevel,
                i;

            freq = freq > 0.001 ? freq : 0.001;
            do {
                if (m.counter <= 0) {
                    m.counter = m.sampleRate / freq;
                    m.counter = m.counter > 1 ? m.counter : 1;
                    if (that.options.interpolation === "linear") {
                        m.start = m.value = m.end;
                        m.end = Math.random();
                        m.ramp = m.ramp = (m.end - m.start) / m.counter;
                    } else {
                        m.start = m.value = Math.random();
                        m.ramp = 0;
                    }
                }
                sampsForLevel = remain < m.counter ? remain : m.counter;
                remain -= sampsForLevel;
                m.counter -= sampsForLevel;
                for (i = 0; i < sampsForLevel; i++) {
                    out[currSamp] = m.value;
                    m.value += m.ramp;
                    currSamp++;
                }

            } while (remain);

            that.mulAdd(numSamps);
        };

        that.input = function () {
            that.model.end = Math.random();
            that.onInputChanged();
        };

        that.input();
        return that;
    };

    fluid.defaults("flock.ugen.lfNoise", {
        rate: "audio",
        inputs: {
            freq: 440,
            mul: null,
            add: null
        },
        ugenOptions: {
            model: {
                counter: 0,
                level: 0
            }
        }
    });

    /*****************************************************
     * Random distributions using Sim.js' Random library *
     *****************************************************/

    // TODO: Unit tests.
    flock.ugen.random = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var generator = that.generator,
                out = that.output,
                i;

            for (i = 0; i < numSamps; i++) {
                out[i] = generator.uniform(-1, 1);
            }

            that.mulAdd(numSamps);
        };

        that.onInputChanged = function (inputName) {
            if (inputName === "seed") {
                that.initGenerator();
            }
            flock.onMulAddInputChanged(that);
        };

        that.initGenerator = function () {
            var seed = that.inputs.seed;
            that.generator = seed ? new Random(seed) : new Random();
        };

        that.init = function () {
            that.initGenerator();
            that.calculateStrides();
            that.onInputChanged();
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.random", {
        rate: "audio",
        inputs: {
            seed: null,
            mul: null,
            add: null
        }
    });

    // TODO: Unit tests.
    flock.ugen.random.exponential = function (inputs, output, options) {
        var that = flock.ugen.random(inputs, output, options);

        that.gen = function (numSamps) {
            var generator = that.generator,
                out = that.output,
                lambda = that.inputs.lambda.output,
                lambdaInc = that.model.strides.lambda,
                i,
                j;

            for (i = j = 0; i < numSamps; i++, j += lambdaInc) {
                out[i] = generator.exponential(lambda[j]);
            }

            that.mulAdd(numSamps);
        };

        return that;
    };

    fluid.defaults("flock.ugen.random.exponential", {
        rate: "audio",
        inputs: {
            seed: null,
            lambda: 1,
            mul: null,
            add: null
        },

        ugenOptions: {
            strideInputs: ["lambda"]
        }
    });

    // TODO: Unit tests.
    flock.ugen.random.gamma = function (inputs, output, options) {
        var that = flock.ugen.random(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                inputs = that.inputs,
                generator = that.generator,
                out = that.output,
                alphaInc = m.strides.alpha,
                alpha = inputs.alpha.output,
                betaInc = m.strides.beta,
                beta = inputs.beta.output,
                i,
                j,
                k;

            for (i = j = k = 0; i < numSamps; i++, j += alphaInc, k += betaInc) {
                out[i] = generator.gamma(alpha[j], beta[k]);
            }

            that.mulAdd(numSamps);
        };

        return that;
    };

    fluid.defaults("flock.ugen.random.gamma", {
        rate: "audio",
        inputs: {
            seed: null,
            alpha: 1,
            beta: 2,
            mul: null,
            add: null
        },

        ugenOptions: {
            strideInputs: ["alpha", "beta"]
        }
    });

    // TODO: Unit tests.
    flock.ugen.random.normal = function (inputs, output, options) {
        var that = flock.ugen.random(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                out = that.output,
                inputs = that.inputs,
                generator = that.generator,
                muInc = m.strides.mu,
                mu = inputs.mu.output,
                sigmaInc = m.strides.sigma,
                sigma = inputs.sigma.output,
                i,
                j,
                k;

            for (i = j = k = 0; i < numSamps; i++, j += muInc, k += sigmaInc) {
                out[i] = generator.normal(mu[j], sigma[k]);
            }

            that.mulAdd(numSamps);
        };

        return that;
    };

    fluid.defaults("flock.ugen.random.normal", {
        rate: "audio",
        inputs: {
            seed: null,
            mu: 0,
            sigma: 1,
            mul: null,
            add: null
        },

        ugenOptions: {
            strideInputs: ["mu", "sigma"]
        }
    });

    // TODO: Unit tests.
    flock.ugen.random.pareto = function (inputs, output, options) {
        var that = flock.ugen.random(inputs, output, options);

        that.gen = function (numSamps) {
            var generator = that.generator,
                out = that.output,
                alphaInc = that.model.strides.alpha,
                alpha = that.inputs.alpha.output,
                i,
                j;

            for (i = j = 0; i < numSamps; i++, j += alphaInc) {
                out[i] = generator.pareto(alpha[j]);
            }

            that.mulAdd(numSamps);
        };

        return that;
    };

    fluid.defaults("flock.ugen.random.pareto", {
        rate: "audio",
        inputs: {
            seed: null,
            alpha: 5,
            mul: null,
            add: null
        },

        ugenOptions: {
            strideInputs: ["alpha"]
        }
    });

    // TODO: Unit tests.
    flock.ugen.random.triangular = function (inputs, output, options) {
        var that = flock.ugen.random(inputs, output, options);

        that.gen = function (numSamps) {
            var generator = that.generator,
                out = that.output,
                modeInc = that.model.strides.mode,
                mode = that.inputs.mode.output,
                i,
                j;

            for (i = j = 0; i < numSamps; i++, j += modeInc) {
                out[i] = generator.triangular(-1, 1, mode[j]);
            }

            that.mulAdd(numSamps);
        };

        return that;
    };

    fluid.defaults("flock.ugen.random.triangular", {
        rate: "audio",
        inputs: {
            seed: null,
            mode: 0.5,
            mul: null,
            add: null
        },

        ugenOptions: {
            strideInputs: ["mode"]
        }
    });

    // TODO: Unit tests.
    flock.ugen.random.weibull = function (inputs, output, options) {
        var that = flock.ugen.random(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                inputs = that.inputs,
                generator = that.generator,
                out = that.output,
                alphaInc = m.strides.alpha,
                alpha = inputs.alpha.output,
                betaInc = m.strides.beta,
                beta = inputs.beta.output,
                i,
                j,
                k;

            for (i = j = k = 0; i < numSamps; i++, j += alphaInc, k += betaInc) {
                out[i] = generator.weibull(alpha[j], beta[k]);
            }

            that.mulAdd(numSamps);
        };

        return that;
    };

    fluid.defaults("flock.ugen.random.weibull", {
        rate: "audio",
        inputs: {
            seed: null,
            alpha: 1,
            beta: 1,
            mul: null,
            add: null
        },

        ugenOptions: {
            strideInputs: ["alpha", "beta"]
        }
    });


    /**************************************
     * Envelopes and Amplitude Processors *
     **************************************/

    flock.ugen.line = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                stepSize = m.stepSize,
                numSteps = m.numSteps,
                numLevelVals = numSteps >= numSamps ? numSamps : numSteps,
                numEndVals = numSamps - numLevelVals,
                level = m.level,
                out = that.output,
                i;

            for (i = 0; i < numLevelVals; i++) {
                out[i] = level;
                numSteps--;
                level += stepSize;
            }

            // TODO: Implement a more efficient gen algorithm when the line has finished.
            if (numEndVals > 0) {
                for (i = 0; i < numEndVals; i++) {
                    out[i] = level;
                }
            }

            m.level = level;
            m.numSteps = numSteps;

            that.mulAdd(numSamps);
        };

        that.onInputChanged = function () {
            var m = that.model;

            // Any change in input value will restart the line.
            m.start = that.inputs.start.output[0];
            m.end = that.inputs.end.output[0];
            m.numSteps = Math.round(that.inputs.duration.output[0] * m.sampleRate); // Duration is seconds.
            if (m.numSteps === 0) {
                m.stepSize = 0.0;
                m.level = m.end;
            } else {
                m.stepSize = (m.end - m.start) / m.numSteps;
                m.level = m.start;
            }

            flock.onMulAddInputChanged(that);
        };

        that.onInputChanged();
        return that;
    };

    fluid.defaults("flock.ugen.line", {
        rate: "control",
        inputs: {
            start: 0.0,
            end: 1.0,
            duration: 1.0,
            mul: null,
            add: null
        }
    });


    flock.ugen.xLine = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                multiplier = m.multiplier,
                numSteps = m.numSteps,
                numLevelVals = numSteps >= numSamps ? numSamps : numSteps,
                numEndVals = numSamps - numLevelVals,
                level = m.level,
                out = that.output,
                i;

            for (i = 0; i < numLevelVals; i++) {
                out[i] = level;
                numSteps--;
                level *= multiplier;
            }

            // TODO: Implement a more efficient gen algorithm when the line has finished.
            if (numEndVals > 0) {
                for (i = 0; i < numEndVals; i++) {
                    out[i] = level;
                }
            }

            m.level = level;
            m.numSteps = numSteps;

            that.mulAdd(numSamps);
        };

        that.onInputChanged = function () {
            var m = that.model;

            flock.onMulAddInputChanged(that);

            // Any change in input value will restart the line.
            m.start = that.inputs.start.output[0];
            if (m.start === 0.0) {
                m.start = Number.MIN_VALUE; // Guard against divide by zero by using the smallest possible number.
            }

            m.end = that.inputs.end.output[0];
            m.numSteps = Math.round(that.inputs.duration.output[0] * m.sampleRate);
            m.multiplier = Math.pow(m.end / m.start, 1.0 / m.numSteps);
            m.level = m.start;
        };

        that.onInputChanged();
        return that;
    };

    fluid.defaults("flock.ugen.xLine", {
        rate: "control",
        inputs: {
            start: 0.0,
            end: 1.0,
            duration: 1.0,
            mul: null,
            add: null
        }
    });

    /**
     * Loops through a linear ramp from start to end, incrementing the output by step.
     * Equivalent to SuperCollider's or CSound's Phasor unit generator.
     *
     * Inputs:
     *  start: the value to start ramping from
     *  end: the value to ramp to
     *  step: the value to increment per sample
     *  reset: the value to return to when the loop is reset by a trigger signal
     *  trigger: a trigger signal that, when it cross the zero line, will reset the loop back to the reset point
     */
    flock.ugen.phasor = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                inputs = that.inputs,
                out = that.output,
                step = inputs.step.output,
                trig = inputs.trigger.output,
                i,
                j,
                k;

            // TODO: Add sample priming to the ugen graph to remove this conditional.
            if (m.value === undefined) {
                m.value = inputs.start.output[0];
            }

            for (i = 0, j = 0, k = 0; i < numSamps; i++, j += m.strides.trigger, k += m.strides.step) {
                if ((trig[j] > 0.0 && m.prevTrig <= 0.0)) {
                    m.value = inputs.reset.output[0];
                }
                m.prevTrig = trig[j];

                if (m.value >= inputs.end.output[0]) {
                    m.value = inputs.start.output[0];
                }

                out[i] = m.value;
                m.value += step[k];
            }

            that.mulAdd(numSamps);
        };

        that.onInputChanged();

        return that;
    };

    fluid.defaults("flock.ugen.phasor", {
        rate: "control",
        inputs: {
            start: 0.0,
            end: 1.0,
            reset: 0.0,
            step: 0.1,
            trigger: 0.0,
            mul: null,
            add: null
        },
        ugenOptions: {
            strideInputs: [
                "trigger",
                "step"
            ]
        }
    });

    flock.ugen.env = {};

    // TODO: Better names for these inputs; harmonize them with flock.ugen.line
    // TODO: Make this a mul/adder.
    flock.ugen.env.simpleASR = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                out = that.output,
                prevGate = m.previousGate,
                gate = that.inputs.gate.output[0],
                level = m.level,
                stage = m.stage,
                currentStep = stage.currentStep,
                stepInc = stage.stepInc,
                numSteps = stage.numSteps,
                targetLevel = m.targetLevel,
                stepsNeedRecalc = false,
                stageTime,
                i;

            // Recalculate the step state if necessary.
            if (prevGate <= 0 && gate > 0) {
                // Starting a new attack stage.
                targetLevel = that.inputs.sustain.output[0];
                stageTime = that.inputs.attack.output[0];
                stepsNeedRecalc = true;
            } else if (gate <= 0 && currentStep >= numSteps) {
                // Starting a new release stage.
                targetLevel = that.inputs.start.output[0];
                stageTime = that.inputs.release.output[0];
                stepsNeedRecalc = true;
            }

            // TODO: Can we get rid of this extra branch without introducing code duplication?
            if (stepsNeedRecalc) {
                numSteps = Math.round(stageTime * m.sampleRate);
                stepInc = (targetLevel - level) / numSteps;
                currentStep = 0;
            }

            // Output the the envelope's sample data.
            for (i = 0; i < numSamps; i++) {
                out[i] = level;
                currentStep++;
                // Hold the last value if the stage is complete, otherwise increment.
                level = currentStep < numSteps ?
                    level + stepInc : currentStep === numSteps ?
                    targetLevel : level;
            }

            // Store instance state.
            m.level = level;
            m.targetLevel = targetLevel;
            m.previousGate = gate;
            stage.currentStep = currentStep;
            stage.stepInc = stepInc;
            stage.numSteps = numSteps;
        };

        that.init = function () {
            var m = that.model;
            m.level = that.inputs.start.output[0];
            m.targetLevel = that.inputs.sustain.output[0];
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.env.simpleASR", {
        rate: "control",
        inputs: {
            start: 0.0,
            attack: 0.01,
            sustain: 1.0,
            release: 1.0,
            gate: 0.0
        },
        ugenOptions: {
            model: {
                previousGate: 0.0,
                stage: {
                    currentStep: 0,
                    stepInc: 0,
                    numSteps: 0
                }
            }
        }
    });

    flock.ugen.amplitude = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                source = that.inputs.source.output,
                out = that.output,
                prevAtt = m.attackTime,
                nextAtt = that.inputs.attack.output[0],
                prevRel = m.releaseTime,
                nextRel = that.inputs.release.output[0],
                prevVal = m.prevVal,
                attCoef = m.attackCoef,
                relCoef = m.releaseCoef,
                i,
                val,
                coef;

            // Convert 60 dB attack and release times to coefficients if they've changed.
            if (nextAtt !== prevAtt) {
                m.attackTime = nextAtt;
                attCoef = m.attackCoef =
                    nextAtt === 0.0 ? 0.0 : Math.exp(flock.LOG01 / (nextAtt * m.sampleRate));
            }

            if (nextRel !== prevRel) {
                m.releaseTime = nextRel;
                relCoef = m.releaseCoef =
                    (nextRel === 0.0) ? 0.0 : Math.exp(flock.LOG01 / (nextRel * m.sampleRate));
            }

            for (i = 0; i < numSamps; i++) {
                val = Math.abs(source[i]);
                coef = val < prevVal ? relCoef : attCoef;
                out[i] = prevVal = val + (prevVal - val) * coef;
            }

            m.prevVal = prevVal;

            that.mulAdd(numSamps);
        };

        that.onInputChanged();
        return that;
    };

    fluid.defaults("flock.ugen.amplitude", {
        rate: "audio",
        inputs: {
            source: null,
            attack: 0.01,
            release: 0.01,
            mul: null,
            add: null
        },
        ugenOptions: {
            model: {
                prevVal: 0.0
            }
        }
    });

    flock.ugen.normalize = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function () {
            var out = that.output,
                max = that.inputs.max.output[0], // Max is kr.
                source = that.inputs.source.output;

            // Note, this normalizes the source input ugen's output buffer directly in place.
            flock.normalize(source, max, out);
        };

        that.onInputChanged();
        return that;
    };

    fluid.defaults("flock.ugen.normalize", {
        rate: "audio",
        inputs: {
            max: 1.0,
            source: null
        }
    });

    /**
     * A gate that allows the source input signal to pass whenever the sideChain input
     * signal is greater than the threshold.
     *
     * If sideChain isn't specifed, the source signal itself is used to open the gate.
     * By default, the gate will output 0.0 if it is closed, but setting the holdLastValue
     * option to true enables it to hold the value of the gate when it was last open.
     *
     * Inputs:
     *     source: the signal that will be outputted whenever the gate is open.
     *     sideChain: (optional) a side chain signal that will
     *         cause the gate to open and close
     *     threshold: the minimum value at which the gate will open
     * Options:
     *      holdLastValue: determines whether the gate should hold its last open value or output silence
     */
    flock.ugen.gate = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                strides = m.strides,
                out = that.output,
                inputs = that.inputs,
                source = inputs.source.output,
                sideChain = inputs.sideChain.output,
                sideChainInc = strides.sideChain,
                threshold = inputs.threshold.output,
                thresholdInc = strides.threshold,
                holdLast = that.options.holdLastValue,
                lastValue = m.lastValue,
                i,
                j,
                k;

            for (i = j = k = 0; i < numSamps; i++, j += sideChainInc, k += thresholdInc) {
                if (sideChain[j] >= threshold[k]) {
                    out[i] = lastValue = source[i];
                } else {
                    // TODO: Don't check holdLast on each sample.
                    out[i] = holdLast ? lastValue : 0;
                }
            }

            m.lastValue = lastValue;
            that.mulAdd(numSamps);
        };

        that.onInputChanged = function () {
            if (!that.inputs.sideChain) {
                that.inputs.sideChain = that.inputs.source;
            }

            flock.onMulAddInputChanged(that);
            that.calculateStrides();
        };

        that.onInputChanged();
        return that;
    };

    fluid.defaults("flock.ugen.gate", {
        rate: "audio",
        inputs: {
            source: null,
            sideChain: null,
            threshold: Number.MIN_VALUE,
            mul: null,
            add: null
        },
        ugenOptions: {
            model: {
                lastValue: 0.0
            },
            holdLastValue: false,
            strideInputs: ["sideChain", "threshold"]
        }
    });


    /**
     * An equal power stereo panner.
     *
     * This unit generator scales the left and right channels
     * with a quarter-wave sin/cos curve so that the levels at the centre
     * are more balanced than a linear pan, reducing the impression that
     * the sound is fading into the distance as it reaches the centrepoint.
     *
     * Inputs:
     *   source: the source (mono) unit signal
     *   pan: a value between -1 (hard left) and 1 (hard right)
     */
    flock.ugen.pan2 = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                outputs = that.output,
                left = outputs[0],
                right = outputs[1],
                inputs = that.inputs,
                source = inputs.source.output,
                pan = inputs.pan.output,
                i,
                j,
                sourceVal,
                panVal;

            for (i = 0, j = 0; i < numSamps; i++, j += m.strides.pan) {
                sourceVal = source[i];
                panVal = pan[j] * 0.5 + 0.5;

                // TODO: Replace this with a lookup table.
                right[i] = sourceVal * Math.sin(panVal * flock.HALFPI);
                left[i] = sourceVal * Math.cos(panVal * flock.HALFPI);
            }

            // TODO: Add multichannel support for mul/add.
        };

        that.onInputChanged();
        return that;
    };

    fluid.defaults("flock.ugen.pan2", {
        rate: "audio",

        inputs: {
            source: null,
            pan: 0 // -1 (hard left)..0 (centre)..1 (hard right)
        },

        ugenOptions: {
            tags: ["flock.ugen.multiChannelOutput"],
            strideInputs: [
                "pan"
            ],
            numOutputs: 2
        }
    });

    /*******************
     * Bus-Level UGens *
     *******************/

    flock.ugen.out = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        // TODO: Implement a "straight out" gen function for cases where the number
        // of sources matches the number of output buses (i.e. where no expansion is necessary).
        that.gen = function (numSamps) {
            var sources = that.multiInputs.sources,
                buses = that.options.audioSettings.buses,
                bufStart = that.inputs.bus.output[0],
                expand = that.inputs.expand.output[0],
                numSources,
                numOutputBuses,
                i,
                j,
                source,
                rate,
                bus,
                inc,
                outIdx;

            numSources = sources.length;
            numOutputBuses = Math.max(expand, numSources);

            if (numSources < 1) {
                return;
            }

            for (i = 0; i < numOutputBuses; i++) {
                source = sources[i % numSources];
                rate = source.rate;
                bus = buses[bufStart + i];
                inc = rate === flock.rates.AUDIO ? 1 : 0;
                outIdx = 0;

                for (j = 0; j < numSamps; j++, outIdx += inc) {
                    // TODO: Support control rate interpolation.
                    // TODO: Don't attempt to write to buses beyond the available number.
                    //       Provide an error at onInputChanged time if the unit generator is configured
                    //       with more sources than available buffers.
                    bus[j] = bus[j] + source.output[outIdx];
                }
            }

            that.mulAdd(numSamps);
        };

        that.init = function () {
            that.sourceBuffers = [];
            that.onInputChanged();
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.out", {
        rate: "audio",
        inputs: {
            sources: null,
            bus: 0,
            expand: 2
        },
        ugenOptions: {
            tags: ["flock.ugen.outputType"],
            multiInputNames: ["sources"]
        }
    });

    // Note: this unit generator currently only outputs values at control rate.
    // TODO: Unit tests.
    flock.ugen.valueOut = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.arraySourceGen = function () {
            var sources = that.inputs.sources,
                i;

            for (i = 0; i < sources.length; i++) {
                that.model.value[i] = sources[i].output[0];
            }
        };

        that.ugenSourceGen = function () {
            that.model.value = that.inputs.sources.output[0];
        };

        that.onInputChanged = function () {
            var sources = that.inputs.sources;
            if (flock.isIterable(sources)) {
                that.gen = that.arraySourceGen;
                that.model.value = new Float32Array(sources.length);
            } else {
                that.gen = that.ugenSourceGen;
            }
        };

        that.onInputChanged();
        return that;
    };

    fluid.defaults("flock.ugen.valueOut", {
        rate: "control",

        inputs: {
            sources: null
        },

        ugenOptions: {
            model: {
                value: null
            },

            tags: ["flock.ugen.outputType", "flock.ugen.valueType"]
        }
    });

    // TODO: fix naming.
    flock.ugen["in"] = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.singleBusGen = function (numSamps) {
            var out = that.output,
                busNum = that.inputs.bus.output[0] | 0,
                bus = that.options.audioSettings.buses[busNum],
                i;

            for (i = 0; i < numSamps; i++) {
                out[i] = bus[i];
            }

            that.mulAdd(numSamps);
        };

        that.multiBusGen = function (numSamps) {
            var busesInput = that.inputs.bus,
                enviroBuses = that.options.audioSettings.buses,
                out = that.output,
                i,
                j,
                busIdx;

            for (i = 0; i < numSamps; i++) {
                out[i] = 0; // Clear previous output values before summing a new set.
                for (j = 0; j < busesInput.length; j++) {
                    busIdx = busesInput[j].output[0] | 0;
                    out[i] += enviroBuses[busIdx][i];
                }
            }

            that.mulAdd(numSamps);
        };

        that.onInputChanged = function () {
            that.gen = flock.isIterable(that.inputs.bus) ? that.multiBusGen : that.singleBusGen;
            flock.onMulAddInputChanged(that);
        };

        that.onInputChanged();
        return that;
    };

    fluid.defaults("flock.ugen.in", {
        rate: "audio",
        inputs: {
            bus: 0,
            mul: null,
            add: null
        }
    });

    flock.ugen.audioIn = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        // TODO: Complete cut and paste of flock.ugen.in.singleBusGen().
        that.gen = function (numSamps) {
            var out = that.output,
                busNum = that.inputs.bus.output[0] | 0,
                bus = that.options.audioSettings.buses[busNum],
                i;

            for (i = 0; i < numSamps; i++) {
                out[i] = bus[i];
            }

            that.mulAdd(numSamps);
        };

        that.onInputChanged = function () {
            flock.onMulAddInputChanged(that);
        };

        that.init = function () {
            // TODO: Direct reference to the shared environment.
            flock.enviro.shared.audioStrategy.startReadingAudioInput();
            that.onInputChanged();
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.audioIn", {
        rate: "audio",
        inputs: {
            bus: 2,
            mul: null,
            add: null
        }
    });


    /***********
     * Filters *
     ***********/

    /**
     * A generic FIR and IIR filter engine. You specify the coefficients, and this will do the rest.
     */
     // TODO: Unit tests.
    flock.ugen.filter = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function () {
            var m = that.model,
                inputs = that.inputs,
                q = inputs.q.output[0],
                freq = inputs.freq.output[0];

            if (m.prevFreq !== freq || m.prevQ !== q) {
                that.updateCoefficients(m, freq, q);
            }

            that.filterEngine.filter(that.output, that.inputs.source.output);

            m.prevQ = q;
            m.prevFreq = freq;
        };

        that.init = function () {
            var recipeOpt = that.options.recipe;
            var recipe = typeof (recipeOpt) === "string" ? flock.get(recipeOpt) : recipeOpt;

            if (!recipe) {
                throw new Error("Can't instantiate a flock.ugen.filter() without specifying a filter coefficient recipe.");
            }

            that.filterEngine = new Filter(recipe.sizes.b, recipe.sizes.a);
            that.model.coeffs = {
                a: that.filterEngine.a,
                b: that.filterEngine.b
            };

            that.updateCoefficients = flock.get(recipe, that.options.type);
            that.onInputChanged();
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.filter", {
        rate: "audio",

        inputs: {
            freq: 440,
            q: 1.0,
            source: null
        }
    });

    /**
     * An optimized biquad filter unit generator.
     */
    // TODO: Unit tests.
    flock.ugen.filter.biquad = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                inputs = that.inputs,
                out = that.output,
                co = m.coeffs,
                freq = inputs.freq.output[0],
                q = inputs.q.output[0],
                source = inputs.source.output,
                i,
                w;

            if (m.prevFreq !== freq || m.prevQ !== q) {
                that.updateCoefficients(m, freq, q);
            }

            for (i = 0; i < numSamps; i++) {
                w = source[i] - co.a[0] * m.d0 - co.a[1] * m.d1;
                out[i] = co.b[0] * w + co.b[1] * m.d0 + co.b[2] * m.d1;
                m.d1 = m.d0;
                m.d0 = w;
            }

            m.prevQ = q;
            m.prevFreq = freq;
        };

        that.onInputChanged = function () {
            var typeOpt = that.options.type;
            that.updateCoefficients = typeof (typeOpt) === "string" ?
                flock.get(typeOpt) : typeOpt;
        };

        that.init = function () {
            that.model.d0 = 0.0;
            that.model.d1 = 0.0;
            that.model.coeffs = {
                a: new Float32Array(2),
                b: new Float32Array(3)
            };
            that.onInputChanged();
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.filter.biquad", {
        inputs: {
            freq: 440,
            q: 1.0,
            source: null
        }
    });

    flock.ugen.filter.biquad.types = {
        "hp": {
            inputDefaults: {
                freq: 440,
                q: 1.0
            },
            options: {
                type: "flock.coefficients.butterworth.highPass"
            }
        },
        "rhp": {
            inputDefaults: {
                freq: 440,
                q: 1.0
            },
            options: {
                type: "flock.coefficients.rbj.highPass"
            }
        },
        "lp": {
            inputDefaults: {
                freq: 440,
                q: 1.0
            },
            options: {
                type: "flock.coefficients.butterworth.lowPass"
            }
        },
        "rlp": {
            inputDefaults: {
                freq: 440,
                q: 1.0
            },
            options: {
                type: "flock.coefficients.rbj.lowPass"
            }
        },
        "bp": {
            inputDefaults: {
                freq: 440,
                q: 4.0
            },
            options: {
                type: "flock.coefficients.butterworth.bandPass"
            }
        },
        "br": {
            inputDefaults: {
                freq: 440,
                q: 1.0
            },
            options: {
                type: "flock.coefficients.butterworth.bandReject"
            }
        }
    };

    // Convenience methods for instantiating common types of biquad filters.
    flock.aliasUGens("flock.ugen.filter.biquad", flock.ugen.filter.biquad.types);

    flock.coefficients = {
        butterworth: {
            sizes: {
                a: 2,
                b: 3
            },

            lowPass: function (model, freq) {
                var co = model.coeffs;
                var lambda = 1 / Math.tan(Math.PI * freq / model.sampleRate);
                var lambdaSquared = lambda * lambda;
                var rootTwoLambda = flock.ROOT2 * lambda;
                var b0 = 1 / (1 + rootTwoLambda + lambdaSquared);
                co.b[0] = b0;
                co.b[1] = 2 * b0;
                co.b[2] = b0;
                co.a[0] = 2 * (1 - lambdaSquared) * b0;
                co.a[1] = (1 - rootTwoLambda + lambdaSquared) * b0;
            },

            highPass: function (model, freq) {
                var co = model.coeffs;
                var lambda = Math.tan(Math.PI * freq / model.sampleRate);
                // Works around NaN values in cases where the frequency
                // is precisely half the sampling rate, and thus lambda
                // is Infinite.
                if (lambda === Infinity) {
                    lambda = 0;
                }
                var lambdaSquared = lambda * lambda;
                var rootTwoLambda = flock.ROOT2 * lambda;
                var b0 = 1 / (1 + rootTwoLambda + lambdaSquared);

                co.b[0] = b0;
                co.b[1] = -2 * b0;
                co.b[2] = b0;
                co.a[0] = 2 * (lambdaSquared - 1) * b0;
                co.a[1] = (1 - rootTwoLambda + lambdaSquared) * b0;
            },

            bandPass: function (model, freq, q) {
                var co = model.coeffs;
                var bw = freq / q;
                var lambda = 1 / Math.tan(Math.PI * bw / model.sampleRate);
                var theta = 2 * Math.cos(flock.TWOPI * freq / model.sampleRate);
                var b0 = 1 / (1 + lambda);

                co.b[0] = b0;
                co.b[1] = 0;
                co.b[2] = -b0;
                co.a[0] = -(lambda * theta * b0);
                co.a[1] = b0 * (lambda - 1);
            },

            bandReject: function (model, freq, q) {
                var co = model.coeffs;
                var bw = freq / q;
                var lambda = Math.tan(Math.PI * bw / model.sampleRate);
                var theta = 2 * Math.cos(flock.TWOPI * freq / model.sampleRate);
                var b0 = 1 / (1 + lambda);
                var b1 = -theta * b0;

                co.b[0] = b0;
                co.b[1] = b1;
                co.b[2] = b0;
                co.a[0] = b1;
                co.a[1] = (1 - lambda) * b0;
            }
        },

        // From Robert Brisow-Johnston's Filter Cookbook:
        // http://dspwiki.com/index.php?title=Cookbook_Formulae_for_audio_EQ_biquad_filter_coefficients
        rbj: {
            sizes: {
                a: 2,
                b: 3
            },

            lowPass: function (model, freq, q) {
                var co = model.coeffs;
                var w0 = flock.TWOPI * freq / model.sampleRate;
                var cosw0 = Math.cos(w0);
                var sinw0 = Math.sin(w0);
                var alpha = sinw0 / (2 * q);
                var oneLessCosw0 = 1 - cosw0;
                var a0 = 1 + alpha;
                var b0 = (oneLessCosw0 / 2) / a0;

                co.b[0] = b0;
                co.b[1] = oneLessCosw0 / a0;
                co.b[2] = b0;
                co.a[0] = (-2 * cosw0) / a0;
                co.a[1] = (1 - alpha) / a0;
            },

            highPass: function (model, freq, q) {
                var co = model.coeffs;
                var w0 = flock.TWOPI * freq / model.sampleRate;
                var cosw0 = Math.cos(w0);
                var sinw0 = Math.sin(w0);
                var alpha = sinw0 / (2 * q);
                var onePlusCosw0 = 1 + cosw0;
                var a0 = 1 + alpha;
                var b0 = (onePlusCosw0 / 2) / a0;

                co.b[0] = b0;
                co.b[1] = (-onePlusCosw0) / a0;
                co.b[2] = b0;
                co.a[0] = (-2 * cosw0) / a0;
                co.a[1] = (1 - alpha) / a0;
            },

            bandPass: function (model, freq, q) {
                var co = model.coeffs;
                var w0 = flock.TWOPI * freq / model.sampleRate;
                var cosw0 = Math.cos(w0);
                var sinw0 = Math.sin(w0);
                var alpha = sinw0 / (2 * q);
                var a0 = 1 + alpha;
                var qByAlpha = q * alpha;

                co.b[0] = qByAlpha / a0;
                co.b[1] = 0;
                co.b[2] = -qByAlpha / a0;
                co.a[0] = (-2 * cosw0) / a0;
                co.a[1] = (1 - alpha) / a0;
            },

            bandReject: function (model, freq, q) {
                var co = model.coeffs;
                var w0 = flock.TWOPI * freq / model.sampleRate;
                var cosw0 = Math.cos(w0);
                var sinw0 = Math.sin(w0);
                var alpha = sinw0 / (2 * q);
                var a0 = 1 + alpha;
                var ra0 = 1 / a0;
                var b1 = (-2 * cosw0) / a0;
                co.b[0] = ra0;
                co.b[1] = b1;
                co.b[2] = ra0;
                co.a[0] = b1;
                co.a[1] = (1 - alpha) / a0;
            }
        }
    };

    /**
     * A Moog-style 24db resonant low-pass filter.
     *
     * This unit generator is based on the following musicdsp snippet:
     * http://www.musicdsp.org/showArchiveComment.php?ArchiveID=26
     *
     * Inputs:
     *   - source: the source signal to process
     *   - cutoff: the cutoff frequency
     *   - resonance: the filter resonance [between 0 and 4, where 4 is self-oscillation]
     */
    // TODO: Unit tests.
    flock.ugen.filter.moog = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                inputs = that.inputs,
                out = that.output,
                source = inputs.source.output,
                sourceInc = m.strides.source,
                res = inputs.resonance.output,
                resInc = m.strides.resonance,
                cutoff = inputs.cutoff.output,
                cutoffInc = m.strides.cutoff,
                f = m.f,
                fSq = m.fSq,
                fSqSq = m.fSqSq,
                oneMinusF = m.oneMinusF,
                fb = m.fb,
                i,
                j,
                k,
                l,
                currCutoff,
                currRes,
                val;

            for (i = j = k = l = 0; i < numSamps; i++, j += sourceInc, k += resInc, l += cutoffInc) {
                currCutoff = cutoff[l];
                currRes = res[k];

                if (currCutoff !== m.prevCutoff) {
                    if (currCutoff > m.nyquistRate) {
                        currCutoff = m.nyquistRate;
                    }

                    f = m.f = (currCutoff / m.nyquistRate) * 1.16;
                    fSq = m.fSq = f * f;
                    fSqSq = m.fSqSq = fSq * fSq;
                    oneMinusF = m.oneMinusF = 1 - f;
                    m.prevRes = undefined; // Flag the need to update fb.
                }

                if (currRes !== m.prevRes) {
                    if (currRes > 4) {
                        currRes = 4;
                    } else if (currRes < 0) {
                        currRes = 0;
                    }

                    fb = m.fb = currRes * (1.0 - 0.15 * fSq);
                }

                val = source[j] - (m.out4 * fb);
                val *= 0.35013 * fSqSq;
                m.out1 = val + 0.3 * m.in1 + oneMinusF * m.out1;
                m.in1 = val;
                m.out2 = m.out1 + 0.3 * m.in2 + oneMinusF * m.out2;
                m.in2 = m.out1;
                m.out3 = m.out2 + 0.3 * m.in3 + oneMinusF * m.out3;
                m.in3 = m.out2;
                m.out4 = m.out3 + 0.3 * m.in4 + oneMinusF * m.out4;
                m.in4 = m.out3;
                out[i] = m.out4;
            }

            that.mulAdd(numSamps);
        };

        that.onInputChanged();
        return that;
    };

    fluid.defaults("flock.ugen.filter.moog", {
        rate: "audio",
        inputs: {
            cutoff: 3000,
            resonance: 3.99,
            source: null
        },
        ugenOptions: {
            model: {
                in1: 0,
                in2: 0,
                in3: 0,
                in4: 0,
                out1: 0,
                out2: 0,
                out3: 0,
                out4: 0,
                prevCutoff: undefined,
                prevResonance: undefined,
                f: undefined,
                fSq: undefined,
                fSqSq: undefined,
                oneMinusF: undefined,
                fb: undefined
            },
            strideInputs: ["source", "cutoff", "resonance"]
        }
    });

    flock.ugen.delay = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                inputs = that.inputs,
                out = that.output,
                source = inputs.source.output,
                time = inputs.time.output[0],
                delayBuffer = that.delayBuffer,
                i;

            if (time !== m.time) {
                m.time = time;
                m.delaySamps = time * that.model.sampleRate;
            }

            for (i = 0; i < numSamps; i++) {
                if (m.pos >= m.delaySamps) {
                    m.pos = 0;
                }
                out[i] = delayBuffer[m.pos];
                delayBuffer[m.pos] = source[i];
                m.pos++;
            }

            that.mulAdd(numSamps);
        };

        that.onInputChanged = function (inputName) {
            flock.onMulAddInputChanged(that);

            if (!inputName || inputName === "maxTime") {
                var delayBufferLength = that.model.sampleRate * that.inputs.maxTime.output[0];
                that.delayBuffer = new Float32Array(delayBufferLength);
            }
        };

        that.onInputChanged();
        return that;
    };

    fluid.defaults("flock.ugen.delay", {
        rate: "audio",
        inputs: {
            maxTime: 1.0,
            time: 1.0,
            source: null
        },
        ugenOptions: {
            model: {
                pos: 0
            }
        }
    });


    // Simple optimised delay for exactly 1 sample
    flock.ugen.delay1 = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                inputs = that.inputs,
                out = that.output,
                source = inputs.source.output,
                i;

            for (i = 0; i < numSamps; i++) {
                out[i] = m.prevVal;
                m.prevVal = source[i];
            }

            that.mulAdd(numSamps);
        };

        that.onInputChanged = function () {
            flock.onMulAddInputChanged(that);
        };

        that.onInputChanged();
        return that;
    };

    fluid.defaults("flock.ugen.delay1", {
        rate: "audio",
        inputs: {
            source: null
        },
        ugenOptions: {
            model: {
                prevVal: 0
            }
        }
    });


    flock.ugen.freeverb = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var o = that.options,
                inputs = that.inputs,
                out = that.output,
                tunings = o.tunings,
                allPassTunings = o.allPassTunings,
                source = inputs.source.output,
                mix = inputs.mix.output[0],
                roomSize = inputs.roomSize.output[0],
                damp = inputs.damp.output[0],
                dry = 1 - mix,
                room_scaled = roomSize * 0.28 + 0.7,
                damp1 = damp * 0.4,
                damp2 = 1.0 - damp1,
                i,
                j;

            for (i = 0; i < numSamps; i++) {
                // read inputs
                var inp = source[i];
                var inp_scaled = inp * 0.015;

                // read samples from the allpasses
                for (j = 0; j < that.buffers_a.length; j++) {
                    if (++that.bufferindices_a[j] === allPassTunings[j]) {
                        that.bufferindices_a[j] = 0;
                    }
                    that.readsamp_a[j] = that.buffers_a[j][that.bufferindices_a[j]];
                }

                // foreach comb buffer, we perform same filtering (only bufferlen differs)
                for (j = 0; j < that.buffers_c.length; j++) {
                    if (++that.bufferindices_c[j] === tunings[j]) {
                        that.bufferindices_c[j] = 0;
                    }
                    var readsamp_c = that.buffers_c[j][that.bufferindices_c[j]];
                    that.filterx_c[j] = (damp2 * that.filtery_c[j]) + (damp1 * that.filterx_c[j]);
                    that.buffers_c[j][that.bufferindices_c[j]] = inp_scaled + (room_scaled * that.filterx_c[j]);
                    that.filtery_c[j] = readsamp_c;
                }

                // each allpass is handled individually, with different calculations made and stored into the delaylines
                var ftemp8 = (that.filtery_c[6] + that.filtery_c[7]);

                that.buffers_a[3][that.bufferindices_a[3]] = ((((0.5 * that.filterx_a[3]) + that.filtery_c[0]) +
                    (that.filtery_c[1] + that.filtery_c[2])) +
                    ((that.filtery_c[3] + that.filtery_c[4]) + (that.filtery_c[5] + ftemp8)));
                that.filterx_a[3] = that.readsamp_a[3];
                that.filtery_a[3] = (that.filterx_a[3] -
                    (((that.filtery_c[0] + that.filtery_c[1]) + (that.filtery_c[2] + that.filtery_c[3])) +
                    ((that.filtery_c[4] + that.filtery_c[5]) + ftemp8)));
                that.buffers_a[2][that.bufferindices_a[2]] = ((0.5 * that.filterx_a[2]) + that.filtery_a[3]);
                that.filterx_a[2] = that.readsamp_a[2];
                that.filtery_a[2] = (that.filterx_a[2] - that.filtery_a[3]);

                that.buffers_a[1][that.bufferindices_a[1]] = ((0.5 * that.filterx_a[1]) + that.filtery_a[2]);
                that.filterx_a[1] = that.readsamp_a[1];
                that.filtery_a[1] = (that.filterx_a[1] - that.filtery_a[2]);

                that.buffers_a[0][that.bufferindices_a[0]] = ((0.5 * that.filterx_a[0]) + that.filtery_a[1]);
                that.filterx_a[0] = that.readsamp_a[0];
                that.filtery_a[0] = (that.filterx_a[0] - that.filtery_a[1]);
                out[i] = ((dry * inp) + (mix * that.filtery_a[0]));
            }

            that.mulAdd(numSamps);
        };

        that.onInputChanged = function () {
            flock.onMulAddInputChanged(that);
        };

        that.initDelayLines = function () {
            var o = that.options,
                tunings = o.tunings,
                allPassTunings = o.allPassTunings;

            // Initialise the delay lines
            that.buffers_c = [];
            that.bufferindices_c = new Int32Array(8);
            that.filterx_c = new Float32Array(8);
            that.filtery_c = new Float32Array(8);
            var spread = that.model.spread;
            var i, j;
            for (i = 0; i < that.buffers_c.length; i++) {
                that.buffers_c[i] = new Float32Array(tunings[i] + spread);
                that.bufferindices_c[i] = 0;
                that.filterx_c[i] = 0;
                that.filtery_c[i] = 0;
                for (j = 0; j < tunings[i] + spread; j++) {
                    that.buffers_c[i][j] = 0;
                }
            }
            that.buffers_a = [];
            that.bufferindices_a = new Int32Array(4);
            that.filterx_a = new Float32Array(4);
            that.filtery_a = new Float32Array(4);
            // "readsamp" vars are temporary values read back from the delay lines,
            // not stored but only used in the gen loop.
            that.readsamp_a = new Float32Array(4);

            for (i = 0; i < 4; i++) {
                that.bufferindices_a[i] = 0;
                that.filterx_a[i] = 0;
                that.filtery_a[i] = 0;
                that.readsamp_a[i] = 0;
                // TODO is this what the spread is meant to do?
                for (j = 0; j < allPassTunings.length; j++) {
                    allPassTunings[j] += spread;
                }
                that.buffers_a[i] = new Float32Array(allPassTunings[i]);
                for (j = 0; j < allPassTunings[i]; j++) {
                    that.buffers_a[i][j] = 0;
                }
            }
        };

        that.init = function () {
            that.initDelayLines();
            that.onInputChanged();
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.freeverb", {
        rate: "audio",
        inputs: {
            mix: 0.5,
            roomSize: 0.6,
            damp: 0.1,
            source: null,
            mul: null,
            add: null
        },
        ugenOptions: {
            model: {
                spread: 0
            },

            tunings: [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617],
            allPassTunings: [556, 441, 341, 225]
        }
    });


    flock.ugen.decay = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                inputs = that.inputs,
                out = that.output,
                source = inputs.source.output,
                time = inputs.time.output[0],
                i;

            if (time !== m.time) {
                m.time = time;
                m.coeff = time === 0.0 ? 0.0 : Math.exp(flock.LOG001 / (time * that.model.sampleRate));
            }

            // TODO: Optimize this conditional.
            if (m.coeff === 0.0) {
                for (i = 0; i < numSamps; i++) {
                    out[i] = source[i];
                }
            } else {
                for (i = 0; i < numSamps; i++) {
                    m.lastSamp = source[i] + m.coeff * m.lastSamp;
                    out[i] = m.lastSamp;
                }
            }

            that.mulAdd(numSamps);
        };

        that.onInputChanged();
        return that;
    };

    fluid.defaults("flock.ugen.decay", {
        rate: "audio",
        inputs: {
            source: null,
            time: 1.0
        },
        ugenOptions: {
            model: {
                time: 0,
                lastSamp: 0,
                coeff: 0
            }
        }
    });

    /****************************
     * Granular Synthesis UGens *
     ****************************/

    /**
     * Triggers grains from an audio buffer.
     *
     * Inputs:
     *   - dur: the duration of each grain (control or constant rate only)
     *   - trigger: a trigger signal that, when it move to a positive number, will start a grain
     *   - buffer: a bufferDef object describing the buffer to granulate
     *   - centerPos: the postion within the sound buffer when the grain will reach maximum amplitude
     *   - amp: the peak amplitude of the grain
     *   - speed: the rate at which grain samples are selected from the buffer; 1.0 is normal speed, -1.0 is backwards
     *
     * Options:
     *   - interpolation: "cubic", "linear", or "none"/undefined
     */
    // TODO: Unit tests.
    flock.ugen.triggerGrains = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                inputs = that.inputs,
                out = that.output,
                chan = inputs.channel.output[0],
                buf = that.buffer.data.channels[chan],
                dur = inputs.dur.output[0],
                amp = inputs.amp.output,
                centerPos = inputs.centerPos.output,
                trigger = inputs.trigger.output,
                speed = inputs.speed.output,
                posIdx = 0,
                trigIdx = 0,
                ampIdx = 0,
                speedIdx = 0,
                i,
                j,
                k,
                grain,
                start,
                samp;

            // Update the grain envelope if the grain duration input has changed.
            // TODO: What happens when this changes while older grains are still sounding?
            if (dur !== m.dur) {
                m.dur = dur > m.maxDur ? m.maxDur : dur;
                m.numGrainSamps = Math.round(m.sampleRate * m.dur);
                m.grainCenter = Math.round(m.numGrainSamps / 2);
                for (i = 0; i < m.numGrainSamps; i++) {
                    m.env[i] = Math.sin(Math.PI * i / m.numGrainSamps);
                }
            }

            // Trigger new grains.
            // TODO: Why does this constantly trigger new grains with an audio rate trigger signal,
            //       rarely or never cleaning old ones up?
            for (i = 0; i < numSamps; i++) {
                if (trigger[trigIdx] > 0.0 && m.prevTrigger <= 0.0 && m.activeGrains.length < m.maxNumGrains) {
                    grain = m.freeGrains.pop();
                    grain.sampIdx = 0;
                    grain.envIdx = 0;
                    grain.amp = amp[ampIdx];
                    start = (centerPos[posIdx] * m.sampleRate) - m.grainCenter;
                    while (start < 0) {
                        start += buf.length;
                    }
                    grain.readPos = Math.round(start);
                    grain.writePos = i;
                    grain.speed = speed[speedIdx];
                    m.activeGrains.push(grain);
                }
                m.prevTrigger = trigger[trigIdx];
                out[i] = 0.0;

                posIdx += m.strides.centerPos;
                trigIdx += m.strides.trigger;
                ampIdx += m.strides.amp;
                speedIdx += m.strides.speed;
            }

            // Output samples for all active grains.
            for (j = 0; j < m.activeGrains.length;) {
                grain = m.activeGrains[j];
                for (k = grain.writePos; k < Math.min(m.numGrainSamps - grain.sampIdx, numSamps); k++) {
                    samp = that.interpolate ? that.interpolate(grain.readPos, buf) : buf[grain.readPos | 0];
                    out[k] += samp * m.env[grain.envIdx] * grain.amp;
                    grain.readPos = (grain.readPos + grain.speed) % buf.length;
                    grain.sampIdx++;
                    grain.envIdx++;
                }
                if (grain.sampIdx >= m.numGrainSamps) {
                    m.freeGrains.push(grain);
                    m.activeGrains.splice(j, 1);
                } else {
                    j++;
                    grain.writePos = grain.writePos % that.options.audioSettings.blockSize;
                }
            }

            that.mulAdd(numSamps);
        };

        that.onInputChanged = function (inputName) {
            that.onBufferInputChanged(inputName);
            that.calculateStrides();
            flock.onMulAddInputChanged(that);
        };

        that.allocateGrains = function (numGrains) {
            numGrains = numGrains || that.model.maxNumGrains;

            for (var i = 0; i < numGrains; i++) {
                that.model.freeGrains.push({
                    sampIdx: 0,
                    envIdx: 0,
                    readPos: 0
                });
            }
        };

        that.init = function () {
            var m = that.model,
                maxGrainLength = Math.round(m.maxDur * m.sampleRate);

            flock.ugen.buffer(that);
            that.model.env = new Float32Array(maxGrainLength);
            that.allocateGrains();
            that.initBuffer();
            that.onInputChanged();
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.triggerGrains", {
        rate: "audio",
        inputs: {
            centerPos: 0,
            channel: 0,
            amp: 1.0,
            dur: 0.1,
            speed: 1.0,
            buffer: null,
            mul: null,
            add: null
        },
        ugenOptions: {
            model: {
                maxDur: 30,
                maxNumGrains: 512,
                activeGrains: [],
                freeGrains: [],
                env: null,
                strides: {}
            },
            strideInputs: [
                "centerPos",
                "trigger",
                "amp",
                "speed"
            ],
            interpolation: "cubic"
        }
    });


    // TODO: Unit tests.
    flock.ugen.print = function (input, output, options) {
        var that = flock.ugen(input, output, options);

        that.gen = function (numSamps) {
            var inputs = that.inputs,
                m = that.model,
                label = m.label,
                chan = inputs.channel,
                // Basic multichannel support. This should be inproved
                // by factoring the multichannel input code out of flock.ugen.out.
                source = chan ? inputs.source.output[chan.output[0]] : inputs.source.output,
                trig = inputs.trigger.output[0],
                freq = inputs.freq.output[0],
                i;

            if (trig > 0.0 && m.prevTrig <= 0.0) {
                fluid.log(fluid.logLevel.IMPORTANT, label + source);
            }

            if (m.freq !== freq) {
                m.sampInterval = Math.round(m.sampleRate / freq);
                m.freq = freq;
                m.counter = m.sampInterval;
            }

            for (i = 0; i < numSamps; i++) {
                if (m.counter >= m.sampInterval) {
                    fluid.log(fluid.logLevel.IMPORTANT, label + source[i]);
                    m.counter = 0;
                }
                m.counter++;
                that.output[i] = source[i];
            }
        };

        that.init = function () {
            var o = that.options;
            that.model.label = o.label ? o.label + ": " : "";
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.print", {
        rate: "audio",
        inputs: {
            source: null,
            trigger: 0.0,
            freq: 1.0
        },
        ugenOptions: {
            model: {
                counter: 0
            }
        }
    });


    /**
     * Granulates a source signal using an integral delay line.
     * This implementation is particularly useful for live granulation.
     * Contributed by Mayank Sanganeria.
     *
     * Inputs:
     *   - grainDur: the duration of each grain (control or constant rate only)
     *   - delayDur: the duration of the delay line (control or constant rate only)
     *   - numGrains: the number of grains to generate (control or constant rate only)
     *   - mul: amplitude scale factor
     *   - add: amplide add
     */
    // TODO: Unit tests.
    flock.ugen.granulator = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                inputs = that.inputs,
                out = that.output,
                grainDur = inputs.grainDur.output[0],
                delayDur = inputs.delayDur.output[0],
                numGrains = inputs.numGrains.output[0],
                source = inputs.source.output,
                i,
                j,
                grainPos,
                windowPos,
                amp;

            // TODO: Probably too expensive to modulate delayDur at control rate.
            // Perhaps either move this into onInputChanged() and treat it as a constant input parameter
            // or introduce a maximum delay length and reuse the same array throughout (just changing indices).
            if (m.delayDur !== delayDur) {
                m.delayDur = delayDur;
                m.delayLength = (m.sampleRate * m.delayDur) | 0;
                that.delayLine = new Float32Array(that.model.delayLength);
            }

            if (m.grainDur !== grainDur) {
                m.grainDur = grainDur;
                m.grainLength = (m.sampleRate * m.grainDur) | 0;
                for (i = 0; i < m.grainLength; i++) {
                    m.windowFunction[i] = Math.sin(Math.PI * i / m.grainLength);
                }
            }

            // If numGrains has changed, zero the extra buffers.
            // Need to hold on to "raw" input so we can compare unrounded values.
            if (m.rawNumGrains !== numGrains) {
                m.rawNumGrains = numGrains;
                numGrains = Math.round(numGrains);
                for (i = m.numGrains; i < numGrains; i++) {
                    m.currentGrainPosition[i] = 0;
                    m.currentGrainWindowPosition[i] = (Math.random() * m.grainLength) | 0;
                }
                m.numGrains = numGrains;
            }

            for (i = 0; i < numSamps; i++) {
                // Update the delay line's write position
                that.delayLine[m.writePos] = source[i];
                m.writePos = (m.writePos + 1) % m.delayLength;

                // Clear the previous output.
                out[i] = 0;

                // Now fill with grains
                for (j = 0; j < m.numGrains; j++) {
                    grainPos = m.currentGrainPosition[j];
                    windowPos = m.currentGrainWindowPosition[j];
                    amp = m.windowFunction[windowPos];
                    out[i] += that.delayLine[grainPos] * amp;

                    // Update positions in the delay line and grain envelope arrays for next time.
                    m.currentGrainPosition[j] = (grainPos + 1) % m.delayLength;
                    m.currentGrainWindowPosition[j] = (windowPos + 1) % m.grainLength;

                    // Randomize the reset position of grains.
                    if (m.currentGrainWindowPosition[j] === 0) {
                        m.currentGrainPosition[j] = (Math.random() * m.delayLength) | 0;
                    }
                }

                // Normalize the output amplitude.
                out[i] /= m.numGrains;
            }

            that.mulAdd(numSamps);
        };

        that.onInputChanged();
        return that;
    };

    fluid.defaults("flock.ugen.granulator", {
        rate: "audio",
        inputs: {
            source: null,
            grainDur: 0.1,
            delayDur: 1,
            numGrains: 5,
            mul: null,
            add: null
        },
        ugenOptions: {
            model: {
                grainLength: 0,
                numGrains: 0,
                currentGrainPosition: [],
                currentGrainWindowPosition: [],
                windowFunction: [],
                writePos: 0
            }
        }
    });

    flock.ugen.sequence = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var list = that.inputs.list,
                inputs = that.inputs,
                freq = inputs.freq.output,
                loop = inputs.loop.output[0],
                m = that.model,
                scale = m.scale,
                out = that.output,
                start = inputs.start ? Math.round(inputs.start.output[0]) : 0,
                end = inputs.end ? Math.round(inputs.end.output[0]) : list.length,
                startItem,
                i,
                j;

            if (m.value === undefined) {
                startItem = list[start];
                m.value = (startItem === undefined) ? 0.0 : startItem;
            }

            if (m.nextIdx === undefined) {
                m.nextIdx = start;
            }

            for (i = 0, j = 0; i < numSamps; i++, j += m.strides.freq) {
                if (m.nextIdx >= end) {
                    if (loop > 0.0) {
                        m.nextIdx = start;
                    } else {
                        out[i] = m.value;
                        continue;
                    }
                }

                out[i] = m.value = list[m.nextIdx];
                m.phase += freq[j] * scale;

                if (m.phase >= 1.0) {
                    m.phase = 0.0;
                    m.nextIdx++;
                }
            }

            that.mulAdd(numSamps);
        };

        that.onInputChanged = function () {
            that.model.scale = that.rate !== flock.rates.DEMAND ? that.model.sampleDur : 1;

            if (!that.inputs.list) {
                that.inputs.list = [];
            }

            that.calculateStrides();
            flock.onMulAddInputChanged(that);
        };

        that.init = function () {
            that.onInputChanged();
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.sequence", {
        rate: "control",

        inputs: {
            start: 0,
            freq: 1.0,
            loop: 0.0,
            list: []
        },

        ugenOptions: {
            model: {
                phase: 0
            },

            strideInputs: ["freq"],
            noExpand: ["list"]
        }
    });

    flock.ugen.midiFreq = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                a4 = m.a4,
                a4Freq = a4.freq,
                a4NoteNum = a4.noteNum,
                notesPerOctave = m.notesPerOctave,
                noteNum = that.inputs.source.output,
                out = that.output,
                i,
                j;

            for (i = 0, j = 0; i < numSamps; i++, j += m.strides.source) {
                out[i] = flock.midiFreq(noteNum[j], a4Freq, a4NoteNum, notesPerOctave);
            }
        };

        that.init = function () {
            that.model.octaveScale = 1 / that.model.notesPerOctave;
            that.onInputChanged();
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.midiFreq", {
        rate: "control",
        inputs: {
            source: null
        },
        ugenOptions: {
            model: {
                a4: {
                    noteNum: 69,
                    freq: 440
                },
                notesPerOctave: 12
            },
            strideInputs: [
                "source"
            ]
        }
    });
}());
;/*
* Flocking Browser-Dependent Unit Generators
* http://github.com/colinbdclark/flocking
*
* Copyright 2013-2014, Colin Clark
* Dual licensed under the MIT and GPL Version 2 licenses.
*/

/*global require, Float32Array, window*/
/*jshint white: false, newcap: true, regexp: true, browser: true,
    forin: false, nomen: true, bitwise: false, maxerr: 100,
    indent: 4, plusplus: false, curly: true, eqeqeq: true,
    freeze: true, latedef: true, noarg: true, nonew: true, quotmark: double, undef: true,
    unused: true, strict: true, asi: false, boss: false, evil: false, expr: false,
    funcscope: false*/

var fluid = fluid || require("infusion"),
    flock = fluid.registerNamespace("flock");

(function () {
    "use strict";

    var $ = fluid.registerNamespace("jQuery");

    fluid.registerNamespace("flock.ugen");

    /***************************
     * Browser-dependent UGens *
     ***************************/

    flock.ugen.scope = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var m = that.model,
                spf = m.spf,
                bufIdx = m.bufIdx,
                buf = m.scope.values,
                i;

            for (i = 0; i < numSamps; i++) {
                buf[bufIdx] = that.inputs.source.output[i];
                if (bufIdx < spf) {
                    bufIdx += 1;
                } else {
                    bufIdx = 0;
                    that.scopeView.refreshView();
                }
            }
            m.bufIdx = bufIdx;
        };

        that.onInputChanged = function () {
            // Pass the "source" input directly back as the output from this ugen.
            that.output = that.inputs.source.output;
        };

        that.init = function () {
            that.model.spf = Math.round(that.model.sampleRate / that.options.fps);
            that.model.bufIdx = 0;

            // Set up the scopeView widget.
            that.model.scope = that.options.styles;
            that.model.scope.values = new Float32Array(that.model.spf);
            that.scopeView = flock.view.scope(that.options.canvas, that.model.scope);

            that.onInputChanged();
            that.scopeView.refreshView();
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.scope", {
        rate: "audio",
        inputs: {
            source: null
        },
        ugenOptions: {
            fps: 60,
            styles: {
                strokeColor: "#777777",
                strokeWidth: 1
            }
        }
    });


    flock.ugen.mouse = {};

    /**
     * Tracks the mouse's position along the specified axis within the boundaries the whole screen.
     * This unit generator will generate a signal between 0.0 and 1.0 based on the position of the mouse;
     * use the mul and add inputs to scale this value to an appropriate control signal.
     */
    flock.ugen.mouse.cursor = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        /**
         * Generates a control rate signal between 0.0 and 1.0 by tracking the mouse's position along the specified axis.
         *
         * @param numSamps the number of samples to generate
         */
        that.exponentialGen = function (numSamps) {
            var m = that.model,
                scaledMouse = m.mousePosition / m.size,
                movingAvg = m.movingAvg,
                lag = that.inputs.lag.output[0],
                add = that.inputs.add.output[0],
                mul = that.inputs.mul.output[0],
                lagCoef = m.lagCoef,
                out = that.output,
                pow = Math.pow,
                i,
                max;

            if (lag !== lagCoef) {
                lagCoef = lag === 0 ? 0.0 : Math.exp(flock.LOG001 / (lag * m.sampleRate));
                m.lagCoef = lagCoef;
            }

            for (i = 0; i < numSamps; i++) {
                max = mul + add;
                scaledMouse = pow(max  / add, scaledMouse) * add;
                movingAvg = scaledMouse + lagCoef * (movingAvg - scaledMouse); // 1-pole filter averages mouse values.
                out[i] = movingAvg;
            }

            m.movingAvg = movingAvg;
        };

        that.linearGen = function (numSamps) {
            var m = that.model,
                scaledMouse = m.mousePosition / m.size,
                movingAvg = m.movingAvg,
                lag = that.inputs.lag.output[0],
                add = that.inputs.add.output[0],
                mul = that.inputs.mul.output[0],
                lagCoef = m.lagCoef,
                out = that.output,
                i;

            if (lag !== lagCoef) {
                lagCoef = lag === 0 ? 0.0 : Math.exp(flock.LOG001 / (lag * m.sampleRate));
                m.lagCoef = lagCoef;
            }

            for (i = 0; i < numSamps; i++) {
                movingAvg = scaledMouse + lagCoef * (movingAvg - scaledMouse);
                out[i] = movingAvg * mul + add;
            }

            m.movingAvg = movingAvg;
        };

        that.noInterpolationGen = function (numSamps) {
            var m = that.model,
                scaledMouse = m.mousePosition / m.size,
                add = that.inputs.add.output[0],
                mul = that.inputs.mul.output[0],
                out = that.output,
                i;

            for (i = 0; i < numSamps; i++) {
                out[i] = scaledMouse * mul + add;
            }
        };

        that.moveListener = function (e) {
            var m = that.model,
                pos = e[m.eventProp],
                off;

            if (pos === undefined) {
                off = $(e.target).offset();
                e.offsetX = e.clientX - off.left;
                e.offsetY = e.clientY - off.top;
                pos = e[m.eventProp];
            }
            m.mousePosition = m.isWithinTarget ? pos : 0.0;
        };

        that.overListener = function () {
            that.model.isWithinTarget = true;
        };

        that.outListener = function () {
            var m = that.model;
            m.isWithinTarget = false;
            m.mousePosition = 0.0;
        };

        that.downListener = function () {
            that.model.isMouseDown = true;
        };

        that.upListener = function () {
            var m = that.model;
            m.isMouseDown = false;
            m.mousePosition = 0;
        };

        that.moveWhileDownListener = function (e) {
            if (that.model.isMouseDown) {
                that.moveListener(e);
            }
        };

        that.bindEvents = function () {
            var m = that.model,
                target = m.target,
                moveListener = that.moveListener;

            if (that.options.onlyOnMouseDown) {
                target.mousedown(that.downListener);
                target.mouseup(that.upListener);
                moveListener = that.moveWhileDownListener;
            }

            target.mouseover(that.overListener);
            target.mouseout(that.outListener);
            target.mousemove(moveListener);
        };

        that.onInputChanged = function () {
            flock.onMulAddInputChanged(that);

            var interp = that.options.interpolation;
            that.gen = interp === "none" ? that.noInterpolationGen : interp === "exponential" ? that.exponentialGen : that.linearGen;
            that.model.exponential = interp === "exponential";
        };

        that.init = function () {
            var m = that.model,
                options = that.options,
                axis = options.axis,
                target = $(options.target || window);

            if (axis === "x" || axis === "width" || axis === "horizontal") {
                m.eventProp = "offsetX";
                m.size = target.width();
            } else {
                m.eventProp = "offsetY";
                m.size = target.height();
            }

            m.mousePosition = 0;
            m.movingAvg = 0;
            m.target = target;

            that.bindEvents();
            that.onInputChanged();
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.mouse.cursor", {
        rate: "control",
        inputs: {
            lag: 0.5,
            add: 0.0,
            mul: 1.0
        },

        ugenOptions: {
            axis: "x"
        }
    });


    flock.ugen.mouse.click = function (inputs, output, options) {
        var that = flock.ugen(inputs, output, options);

        that.gen = function (numSamps) {
            var out = that.output,
                m = that.model,
                i;

            for (i = 0; i < numSamps; i++) {
                out[i] = m.value;
            }

            that.mulAdd(numSamps);
        };

        that.mouseDownListener = function () {
            that.model.value = 1.0;
        };

        that.mouseUpListener = function () {
            that.model.value = 0.0;
        };

        that.init = function () {
            var m = that.model;
            m.target = typeof (that.options.target) === "string" ?
                document.querySelector(that.options.target) : that.options.target || window;
            m.value = 0.0;
            m.target.addEventListener("mousedown", that.mouseDownListener, false);
            m.target.addEventListener("mouseup", that.mouseUpListener, false);

            that.onInputChanged();
        };

        that.onInputChanged = function () {
            flock.onMulAddInputChanged(that);
        };

        that.init();
        return that;
    };

    fluid.defaults("flock.ugen.mouse.click", {
        rate: "control"
    });

}());
;/*!
* Flocking - Creative audio synthesis for the Web!
* http://github.com/colinbdclark/flocking
*
* Copyright 2011-2014, Colin Clark
* Dual licensed under the MIT or GPL Version 2 licenses.
*/

/*global require*/
/*jshint white: false, newcap: true, regexp: true, browser: true,
    forin: false, nomen: true, bitwise: false, maxerr: 100,
    indent: 4, plusplus: false, curly: true, eqeqeq: true,
    freeze: true, latedef: true, noarg: true, nonew: true, quotmark: double, undef: true,
    unused: true, strict: true, asi: false, boss: false, evil: false, expr: false,
    funcscope: false*/

var fluid = fluid || require("infusion"),
    flock = fluid.registerNamespace("flock");

(function () {
    "use strict";
    
    fluid.registerNamespace("flock.view");
    
    // TODO: Infusionize.
    flock.view.scope = function (canvas, model) {
        var that = {
            model: model || {
                values: []
            },
            canvas: typeof (canvas) === "string" ? document.querySelector(canvas) : canvas
        };
        
        that.refreshView = function () {
            var ctx = that.ctx,
                h = that.model.height,
                halfH = that.model.halfHeight,
                w = that.model.width,
                vals = that.model.values,
                len = vals.length,
                scaleX = that.model.scaleX * (w / len), // TODO: Doesn't support scale values < 1.0
                i,
                x,
                y;
        
            ctx.clearRect(0, 0, w, h);
            ctx.beginPath();
            for (i = 0; i < len; i++) {
                x = i * scaleX;
                y = vals[i] * that.model.scaleY * halfH + halfH;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        };
        
        that.init = function () {
            that.ctx = that.canvas.getContext("2d");
            that.ctx.fillStyle = that.model.fill || that.ctx.fillStyle;
            that.ctx.strokeStyle = that.model.strokeColor || that.ctx.strokeStyle;
            that.ctx.lineWidth = that.model.strokeWidth || that.ctx.lineWidth;
        
            that.model.min = that.model.min || -1.0;
            that.model.max = that.model.max || 1.0;
            that.model.height = that.canvas.height;
            that.model.halfHeight = that.model.height / 2;
            that.model.width = that.canvas.width;
            that.model.scaleX = that.model.scaleX || that.model.scale || 1.0;
            that.model.scaleY = that.model.scaleY || that.model.scale || 1.0;
            
            that.refreshView();
        };
        
        that.init();
        return that;
    };
    
}());
;/*
 * Flocking MIDI
 * http://github.com/colinbdclark/flocking
 *
 * Copyright 2014, Colin Clark
 * Dual licensed under the MIT and GPL Version 2 licenses.
 */

/*global require*/
/*jshint white: false, newcap: true, regexp: true, browser: true,
    forin: false, nomen: true, bitwise: false, maxerr: 100,
    indent: 4, plusplus: false, curly: true, eqeqeq: true,
    freeze: true, latedef: true, noarg: true, nonew: true, quotmark: double, undef: true,
    unused: true, strict: true, asi: false, boss: false, evil: false, expr: false,
    funcscope: false*/

var fluid = fluid || require("infusion"),
    flock = fluid.registerNamespace("flock");

(function () {

    "use strict";

    fluid.registerNamespace("flock.midi");

    flock.midi.requestAccess = function (sysex, onAccessGranted, onError) {
        if (!navigator.requestMIDIAccess) {
            var msg = "The Web MIDI API is not available. You may need to enable it in your browser's settings.";
            fluid.log(fluid.logLevel.WARN, msg);
            onError(msg);
            return;
        }

        var p = navigator.requestMIDIAccess({
            sysex: sysex
        });

        p.then(onAccessGranted, onError);
    };

    flock.midi.getPorts = function (access) {
        var ports = {};

        if (access.inputs) {
            ports.inputs = access.inputs();
        }

        if (access.outputs) {
            ports.outputs = access.outputs();
        }

        return ports;
    };

    flock.midi.read = function (data) {
        var status = data[0],
            type = status >> 4,
            chan = status & 0xf,
            fn;

        switch (type) {
            case 8:
                fn = flock.midi.read.noteOff;
                break;
            case 9:
                fn = data[2] > 0 ? flock.midi.read.noteOn : flock.midi.read.noteOff;
                break;
            case 10:
                fn = flock.midi.read.polyAftertouch;
                break;
            case 11:
                fn = flock.midi.read.controlChange;
                break;
            case 12:
                fn = flock.midi.read.programChange;
                break;
            case 13:
                fn = flock.midi.read.channelAftertouch;
                break;
            case 14:
                fn = flock.midi.read.pitchbend;
                break;
            case 15:
                fn = flock.midi.read.sysex;
                break;
            default:
                throw new Error("Recieved an unrecognized MIDI message: " + data);
        }

        return fn(chan, data);
    };

    flock.midi.read.note = function (type, chan, data) {
        return {
            type: type,
            chan: chan,
            note: data[1],
            velocity: data[2]
        };
    };

    flock.midi.read.noteOn = function (chan, data) {
        return flock.midi.read.note("noteOn", chan, data);
    };

    flock.midi.read.noteOff = function (chan, data) {
        return flock.midi.read.note("noteOff", chan, data);
    };

    flock.midi.read.polyAftertouch = function (chan, data) {
        return {
            type: "aftertouch",
            chan: chan,
            note: data[1],
            pressure: data[2]
        };
    };

    flock.midi.read.controlChange = function (chan, data) {
        return {
            type: "control",
            chan: chan,
            number: data[1],
            value: data[2]
        };
    };

    flock.midi.read.programChange = function (chan, data) {
        return {
            type: "program",
            chan: chan,
            program: data[1]
        };
    };

    flock.midi.read.channelAftertouch = function (chan, data) {
        return {
            type: "aftertouch",
            chan: chan,
            pressure: data[1]
        };
    };

    flock.midi.read.pitchbend = function (chan, data) {
        return {
            type: "pitchbend",
            chan: chan,
            value: (data[1] << 7) | data[2]
        };
    };

    flock.midi.read.sysex = function (chan, data) {
        return {
            type: "system",
            chan: chan,
            data: data.subarray(1)
        };
    };


    /**
     * Represents the overall Web MIDI system,
     * including references to all the available MIDI ports
     * and the MIDIAccess object.
     */
    fluid.defaults("flock.midi.system", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],

        sysex: true,

        members: {
            access: undefined,
            ports: undefined
        },

        invokers: {
            requestAccess: {
                funcName: "flock.midi.requestAccess",
                args: [
                    "{that}.options.sysex",
                    "{that}.events.onAccessGranted.fire",
                    "{that}.events.onAccessError.fire"
                ]
            },

            refreshPorts: {
                funcName: "flock.midi.system.refreshPorts",
                args: ["{that}", "{that}.access"]
            }
        },

        events: {
            onAccessGranted: null,
            onAccessError: null,
            onReady: null
        },

        listeners: {
            onCreate: {
                func: "{that}.requestAccess"
            },

            onAccessGranted: [
                {
                    funcName: "flock.midi.system.setAccess",
                    args: ["{that}", "{arguments}.0"]
                },
                {
                    func: "{that}.refreshPorts"
                },
                {
                    func: "{that}.events.onReady.fire",
                    args: "{that}.ports"
                }
            ],

            onAccessError: {
                funcName: "fluid.log",
                args: [fluid.logLevel.WARN, "{arguments}.0"]
            }
        }
    });

    flock.midi.system.setAccess = function (that, access) {
        that.access = access;
    };

    flock.midi.system.refreshPorts = function (that, access) {
        that.ports = flock.midi.getPorts(access);
    };


    /*
     * A MIDI Connection represents a connection between an arbitrary set of
     * input and output ports across one or more MIDI devices connected to the system.
     */
    // TODO: Handle port disconnection events.
    fluid.defaults("flock.midi.connection", {
        gradeNames: ["fluid.eventedComponent", "autoInit"],

        sysex: false,
        openImmediately: false,

        // Supported PortSpec formats:
        //  - Number: the index of the input and output port to use (this is the default)
        //  - { manufacturer: "akai", name: "LPD8"}
        //  - { input: Number, output: Number}
        //  - { input: { manufacturer: "akai", name: "LPD8"}, output: {manufacturer: "korg", name: "output"}}
        ports: 0,

        invokers: {
            send: {
                func: "{that}.events.onSendMessage.fire"
            },

            open: {
                funcName: "flock.midi.connection.bind",
                args: [
                    "{system}.ports",
                    "{that}.options.ports",
                    "{that}.events.raw.fire",
                    "{that}.events.onSendMessage"
                ]
            },

            close: {
                funcName: "flock.midi.connection.close",
                args: [
                    "{system}.ports",
                    "{that}.events.raw.fire"
                ]
            }
        },

        components: {
            system: {
                type: "flock.midi.system",
                options: {
                    listeners: {
                        onReady: {
                            funcName: "flock.midi.connection.autoOpen",
                            args: ["{connection}.options.openImmediately", "{connection}.open"]
                        }
                    }
                }
            }
        },

        events: {
            onReady: "{system}.events.onReady",
            onError: null,
            onSendMessage: null,

            raw: null,
            message: null,
            note: null,
            noteOn: null,
            noteOff: null,
            control: null,
            program: null,
            aftertouch: null,
            pitchbend: null
        },

        listeners: {
            onError: {
                funcName: "fluid.log",
                args: [fluid.logLevel.WARN, "{arguments}.0"]
            },

            raw: {
                funcName: "flock.midi.connection.fireEvent",
                args: ["{arguments}.0", "{that}.events"]
            }
        }
    });

    flock.midi.connection.autoOpen = function (openImmediately, openFn) {
        if (openImmediately) {
            openFn();
        }
    };

    flock.midi.findPorts = function (ports, portSpecs) {
        portSpecs = fluid.makeArray(portSpecs);

        var matches = [];

        fluid.each(portSpecs, function (portSpec) {
            var portFinder = flock.midi.findPorts.portFinder(portSpec),
                matchesForSpec = portFinder(ports);

            matches = matches.concat(matchesForSpec);
        });

        return matches;
    };

    flock.midi.findPorts.portFinder = function (portSpec) {
        if (typeof portSpec === "number") {
            return flock.midi.findPorts.byIndex(portSpec);
        }

        if (portSpec.id) {
            return function (ports) {
                ports.find(flock.midi.findPorts.idMatcher(portSpec.id));
            };
        }

        var matcher = portSpec.manufacturer && portSpec.name ?
            flock.midi.findPorts.bothMatcher(portSpec.manufacturer, portSpec.name) :
            portSpec.manufacturer ? flock.midi.findPorts.manufacturerMatcher(portSpec.manufacturer) :
            flock.midi.findPorts.nameMatcher(portSpec.name);

        return function (ports) {
            return ports.filter(matcher);
        };
    };

    flock.midi.findPorts.byIndex = function (idx) {
        return function (ports) {
            var port = ports[idx];
            return port ? [port] : [];
        };
    };

    flock.midi.findPorts.lowerRegExMatcher = function (matchSpec) {
        return function (obj) {
            var isMatch = false;
            for (var prop in matchSpec) {
                var objVal = obj[prop];
                var matchVal = matchSpec[prop];

                isMatch = objVal && objVal.toLowerCase().match(matchVal.toLowerCase());
                if (!isMatch) {
                    break;
                }
            }

            return isMatch;
        };
    };

    flock.midi.findPorts.idMatcher = function (id) {
        return function (port) {
            return port.id === id;
        };
    };

    flock.midi.findPorts.bothMatcher = function (manu, name) {
        return flock.midi.findPorts.lowerRegExMatcher({
            manufacturer: manu,
            name: name
        });
    };

    flock.midi.findPorts.manufacturerMatcher = function (manu) {
        return flock.midi.findPorts.lowerRegExMatcher({
            manufacturer: manu
        });
    };

    flock.midi.findPorts.nameMatcher = function (name) {
        return flock.midi.findPorts.lowerRegExMatcher({
            name: name
        });
    };

    flock.midi.findPorts.eachPortOfType = function (port, type, fn) {
        var ports = fluid.makeArray(port);
        fluid.each(ports, function (port) {
            if (port.type === type) {
                fn(port);
            }
        });
    };

    flock.midi.connection.listen = function (port, onRaw) {
        flock.midi.findPorts.eachPortOfType(port, "input", function (port) {
            port.addEventListener("midimessage", onRaw, false);
        });
    };

    flock.midi.connection.stopListening = function (port, onRaw) {
        flock.midi.findPorts.eachPortOfType(port, "input", function (port) {
            port.removeEventListener("midimessage", onRaw, false);
        });
    };

    flock.midi.connection.bindSender = function (port, onSendMessage) {
        var ports = fluid.makeArray(port);
        fluid.each(ports, function (port) {
            onSendMessage.addListener(port.send.bind(port));
        });
    };

    flock.midi.connection.bind = function (ports, portSpec, onRaw, onSendMessage) {
        portSpec = flock.midi.connection.expandPortSpec(portSpec);

        var input = flock.midi.findPorts(ports.inputs, portSpec.input),
            output = flock.midi.findPorts(ports.outputs, portSpec.output);

        if (input && input.length > 0) {
            flock.midi.connection.listen(input, onRaw);
        } else if (portSpec.input !== undefined) {
            flock.midi.connection.logNoMatchedPorts("input", portSpec);
        }

        if (output && output.length > 0) {
            flock.midi.connection.bindSender(output, onSendMessage);
        } else if (portSpec.output !== undefined) {
            flock.midi.connection.logNoMatchedPorts("output", portSpec);
        }
    };

    flock.midi.connection.close = function (ports, onRaw) {
        flock.midi.connection.stopListening(ports.inputs, onRaw);
        // TODO: Come up with some scheme for unbinding port senders
        // since they use Function.bind().
    };

    flock.midi.connection.logNoMatchedPorts = function (type, portSpec) {
        fluid.log(fluid.logLevel.WARN,
            "No matching " + type + " ports were found for port specification: ", portSpec[type]);
    };

    flock.midi.connection.expandPortSpec = function (portSpec) {
        if (portSpec.input !== undefined || portSpec.output !== undefined) {
            return portSpec;
        }

        var expanded = {
            input: {},
            output: {}
        };

        if (typeof portSpec === "number") {
            expanded.input = expanded.output = portSpec;
        } else {
            flock.midi.connection.expandPortSpecProperty("manufacturer", portSpec, expanded);
            flock.midi.connection.expandPortSpecProperty("name", portSpec, expanded);
        }

        return expanded;
    };

    flock.midi.connection.expandPortSpecProperty = function (propName, portSpec, expanded) {
        expanded.input[propName] = expanded.output[propName] = portSpec[propName];
        return expanded;
    };

    flock.midi.connection.fireEvent = function (midiEvent, events) {
        var model = flock.midi.read(midiEvent.data),
            eventForType = model.type ? events[model.type] : undefined;

        events.message.fire(model);

        // TODO: Remove this special-casing of noteOn/noteOff events into note events.
        if (model.type === "noteOn" || model.type === "noteOff") {
            events.note.fire(model);
        }

        if (eventForType) {
            eventForType.fire(model);
        }
    };

}());
