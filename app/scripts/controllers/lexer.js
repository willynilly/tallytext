'use strict';

/**
 * @ngdoc function
 * @name tallytextApp.controller:LexerCtrl
 * @description
 * # LexerCtrl
 * Controller of the tallytextApp
 */
angular.module('tallytextApp')
  .controller('LexerCtrl', ['$scope', 'lexer', function ($scope, lexer) {
		var self = this;
    
		this._haystackTokenCollectionName = ''; // the token collection name of haystack tokens
		this._needleTokenCollectionName = ''; // the token collection name of needle tokens

		this.knownWords = [];
		this.totalWordCount = 0;
		this.words = [];
		this.wordCounts = {};
		
		this.onNeedleTokenChange = function() {
			self._update();
		};
		
		this.onHaystackTokenChange = function() {
			self._update();
		};
		
		this.setHaystackTokenCollectionName = function(collectionName) {
			console.log('setHaystackTokenCollectionName');
			
			var prevHaystackTokenCollectionName = this._haystackTokenCollectionName;
			this._haystackTokenCollectionName = collectionName;
			
			// remove old callback
			if (prevHaystackTokenCollectionName !== '') {
				lexer.removeOnTokenChange(prevHaystackTokenCollectionName, self.onHaystackTokenChange);
			}
			
			// add new callback
			lexer.onTokenChange(this._haystackTokenCollectionName, self.onHaystackTokenChange);
		};
		
		this.setNeedleTokenCollectionName = function(collectionName) {
			console.log('setNeedleTokenCollectionName');
			
			var prevNeedleTokenCollectionName = this._needleTokenCollectionName;
			this._needleTokenCollectionName = collectionName;
			
			// remove old callback
			if (prevNeedleTokenCollectionName !== '') {
				lexer.removeOnTokenChange(prevNeedleTokenCollectionName, self.onNeedleTokenChange);
			}
			
			// add new callback
			lexer.onTokenChange(this._needleTokenCollectionName, self.onNeedleTokenChange);			
		};
		
		this.setKnownWordsFromString = function(collectionName, s) {
			console.log('setKnownWordsFromString');
			
			this.setNeedleTokenCollectionName(collectionName);
			lexer.setTokensFromString(collectionName, s);
			this.knownWords = lexer.getTokens(collectionName);
		};
		
		this.init = function(haystackCollectionName, needleCollectionName, wordsString) {
			this.setHaystackTokenCollectionName(haystackCollectionName); 
			this.setKnownWordsFromString(needleCollectionName, wordsString);
		}
		
		this._update = function() {
			self.wordCounts = lexer.getTokenCountsForTargetTokens(self._haystackTokenCollectionName, self.knownWords);
			self.words = lexer.getUniqueTokensFromTokenCounts(self.wordCounts, true);
			self.totalWordCount = lexer.getTotalTokenCountFromTokenCounts(self.wordCounts);
		};

  }]);