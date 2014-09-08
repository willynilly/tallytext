'use strict';

angular.module('lexerDude', [])
  .factory('lexer', function() {
  	
		// return an array of tokens from a string, where tokens are
		// trimmed, lowercased, with punctuation removed from front and back of each token
		var getTokensFromString = function(s) {
			var tokens = s.trim().replace(/(\s)+/g, ' ')
									 .split(' ')
									 .map(function(s){return s.trim().replace(/((\W)+$)|(^(\W)+)/g, '').toLowerCase();})
									 .filter(function(s) {return s !== '';});
			return tokens;
		};
		
		// returns an array of tokens associated with the collection name
		// if the collection name does not exist, it returns an empty array
		var getTokens = function(collectionName) {
			if (!(collectionName in this._tokensByCollectionName)) {
				this.setTokens(collectionName, []);
			}
			return this._tokensByCollectionName[collectionName];
		};
		
		// set the tokens for an associated collection name
		var setTokens = function(collectionName, tokens) {
			this._tokensByCollectionName[collectionName] = tokens;
			this._updateTokenCounts(collectionName);
			this._notifyOnTokenChange(collectionName);
		};
		
		// set the tokens from string for an associated collection name
		var setTokensFromString = function(collectionName, s) {
			var tokens = this.getTokensFromString(s);
			this.setTokens(collectionName, tokens);
		};

		// return unique tokens sorted by token count descending and then alphabetically ascending
		var getUniqueTokens = function(collectionName, removeEmptyCounts) {
			var tokenCounts = this.getTokenCounts(collectionName);
			return this.getUniqueTokensFromTokenCounts(tokenCounts, removeEmptyCounts);
		};
		
		// return unique tokens sorted by token count descending and then alphabetically ascending
		var getUniqueTokensFromTokenCounts = function(tokenCounts, removeEmptyCounts) {
			return Object.keys(tokenCounts)
									 .filter(function(t){
										 return !removeEmptyCounts || tokenCounts[t] > 0;
									 })
									 .sort(function(a, b) {
											if (tokenCounts[a] < tokenCounts[b]) {
												return 1;
											} else if (tokenCounts[a] > tokenCounts[b]) {
												return -1;
											} else {
												return a > b;
											}
										});
		};
		
		// add tokens from a string to an existing collection of tokens
		var addTokensFromString = function(collectionName, s) {
			var oldTokens = getTokens(collectionName);
			var newTokens = getTokensFromString(s);
			this.setTokens(oldTokens.push.apply(oldTokens, newTokens));
		};

		// return a dictionary of token counts indexed by token
		var getTokenCounts = function(collectionName) {			
			if (!(collectionName in this._tokenCountsByCollectionName)) {
				this._updateTokenCounts(collectionName);
			}
			return this._tokenCountsByCollectionName[collectionName];			
		};
		
		// set the token counts for an associated collection of tokens
		var setTokenCounts = function(collectionName, tokenCounts) {
			this._tokenCountsByCollectionName[collectionName] = tokenCounts;
		};
		
		// update the token counts for an associated collection of tokens
		var _updateTokenCounts = function(collectionName) {
			var tokens = this.getTokens(collectionName);
			this.setTokenCounts(collectionName, this.getTokenCountsFromTokens(tokens));
		};
		
		// return a dictionary of token counts for an array of tokens
		var getTokenCountsFromTokens = function(tokens) {
			return tokens.reduce(function(prev, cur) {
				if (!(cur in prev)) {prev[cur] = 0;}
				prev[cur]++;
				return prev;
			}, {});
		};
		
		// return a dictionary of token counts for a set of target tokens 
		// from an existing dictionary of token counts
		var getTokenCountsForTargetTokens = function(collectionName, targetTokens) {
			var tokenCounts = this.getTokenCounts(collectionName);
			return targetTokens.reduce(function(prev, cur) {
				if (!(cur in prev)) {prev[cur] = 0;}
				if (cur in tokenCounts) {
					prev[cur] += tokenCounts[cur];
				}
				return prev;
			}, {});
		};

		// return the total count of all tokens in a collection
		var getTotalTokenCountFromTokenCounts = function(tokenCounts) {
			return Object.keys(tokenCounts).reduce(function(prev, cur) {
				prev += tokenCounts[cur];
				return prev;
			}, 0);
		};

		var onTokenChange = function(collectionName, callback) {
			if (!(collectionName in this._onTokenChangeCallbacks)) {
				this._onTokenChangeCallbacks[collectionName] = [];
			}
			this._onTokenChangeCallbacks[collectionName].push(callback);
		};
		
		var removeOnTokenChange = function(collectionName, callback) {
			console.log('removed token change');
			if (collectionName in this._onTokenChangeCallbacks) {
				var filtered = this._onTokenChangeCallbacks[collectionName].filter(function(c){return c!==callback;});
				this._onTokenChangeCallbacks[collectionName] = filtered;
			}
		};
		
		var _notifyOnTokenChange = function(collectionName) {			
			if (collectionName in this._onTokenChangeCallbacks) {
				console.log('notifying change for ' + collectionName);
				
				var callbackCount = this._onTokenChangeCallbacks[collectionName].length;
				console.log(callbackCount);
				this._onTokenChangeCallbacks[collectionName].map(function(callback){
					callback();
				});
			}	
		};

		return {
			_tokensByCollectionName: {},
			_tokenCountsByCollectionName: {},
			_updateTokenCounts: _updateTokenCounts,
			
			_onTokenChangeCallbacks: {},
			_notifyOnTokenChange: _notifyOnTokenChange,
			
			onTokenChange: onTokenChange,
			
			getTokensFromString: getTokensFromString,
			getTokens: getTokens,
			setTokens: setTokens,
			setTokensFromString: setTokensFromString,
			addTokensFromString: addTokensFromString,
			getUniqueTokens: getUniqueTokens,
			getUniqueTokensFromTokenCounts: getUniqueTokensFromTokenCounts,
						
			getTokenCounts: getTokenCounts,
			setTokenCounts: setTokenCounts,
			getTokenCountsFromTokens: getTokenCountsFromTokens,
			getTokenCountsForTargetTokens: getTokenCountsForTargetTokens,
			getTotalTokenCountFromTokenCounts: getTotalTokenCountFromTokenCounts,
  	};
  });