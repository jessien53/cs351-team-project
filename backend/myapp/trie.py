# -*- coding: utf-8 -*-
"""
@author: Jessie Nouna for CS 351 Project 2 and adapted for Autocomplete
"""


class TrieNode:
    """
    A node in the Trie structure. Each node represents a character.
    """

    def __init__(self, char=""):
        self.char = char
        self.is_word = False
        self.children = {}


class Trie:
    """
    A Trie data structure for storing and searching a dictionary of words.
    """

    def __init__(self):
        self.root = TrieNode()
        self.word_counter = 0

    def getFromFile(self, fname: str):
        try:
            with open(fname, "r", encoding="utf-8") as file:
                for line in file:
                    words_in_line = line.split()
                    for word in words_in_line:
                        self.insert(word)
            return True
        except IOError:
            return False

    def insert(self, word: str):
        if not isinstance(word, str):
            return False

        # Sanitize the word: remove punctuation, keep letters/numbers
        # This turns "(Like" into "Like" and "141" into "141"
        sanitized_word = "".join(filter(str.isalnum, word)).lower()

        if not sanitized_word:  # Skip empty strings (e.g., if word was just "-")
            return False

        current_node = self.root
        for char in sanitized_word:
            if char not in current_node.children:
                current_node.children[char] = TrieNode(char)
            current_node = current_node.children[char]

        if current_node.is_word:  # Already exists
            return False

        current_node.is_word = True
        self.word_counter += 1
        return True

    def search(self, word: str):
        # ... (rest of the method is unchanged)
        if not isinstance(word, str) or not word.isalpha():
            return False
        current_node = self.root
        word_lower = word.lower()
        for char in word_lower:
            if char not in current_node.children:
                return False
            current_node = current_node.children[char]
        return current_node.is_word

    # New method for autocomplete
    def get_suggestions(self, prefix: str):
        """
        Returns a list of all words in the Trie that start with the given prefix.

        Args:
            prefix (str): The prefix to search for.
        Returns:
            list[str]: A list of words that start with the prefix.
        """
        prefix_lower = prefix.lower()
        
        # 1. Find the node where the prefix ends
        prefix_node = self._find_prefix_node(prefix_lower)
        
        if not prefix_node:
            return [] # Prefix does not exist in the Trie
        
        # 2. Collect all words starting from that node
        suggestions = []
        self._dfs_words(prefix_node, prefix_lower, suggestions)
        
        return suggestions

    def _find_prefix_node(self, prefix: str):
        """
        Traverses the Trie to the node representing the end of the prefix.
        
        Args:
            prefix (str): The prefix to navigate to.
        Returns:
            TrieNode or None: The node at the end of the prefix, or None if not found.
        """
        current_node = self.root
        for char in prefix:
            if char not in current_node.children:
                return None
            current_node = current_node.children[char]
        return current_node

    def remove(self, word: str):
        # ... (method is unchanged)
        if not self.search(word):
            return False
        current_node = self.root
        word_lower = word.lower()
        for char in word_lower:
            current_node = current_node.children[char]
        if current_node.is_word:
            current_node.is_word = False
            self.word_counter -= 1
            return True
        return False

    def clear(self) -> bool:
        # ... (method is unchanged)
        self.root = TrieNode()
        self.word_counter = 0
        return True

    def wordCount(self) -> int:
        # ... (method is unchanged)
        return self.word_counter

    def words(self):
        # ... (method is unchanged)
        word_list = []
        self._dfs_words(self.root, "", word_list)
        return word_list

    def _dfs_words(self, node: TrieNode, prefix: str, word_list: list[str]):
        # ... (method is unchanged, but now also used by get_suggestions)
        if node.is_word:
            word_list.append(prefix)
        for char in sorted(node.children.keys()):
            self._dfs_words(node.children[char], prefix + char, word_list)