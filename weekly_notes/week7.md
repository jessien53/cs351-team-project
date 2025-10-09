# Requirement: Figma Wireframe

Rei will start with some basic desgin/formating of main pages then will split up work following those as guides

**Main Pages**

- Home / feed screen
- Browse / search screen
- Messages screen
- Profile screen

**Priority Pages**

- Authentication & Onboarding
  - Sign up / registration screen
  - Login screen
  - Profile setup / College Selection
- Listing Management
  - Create new listing screen
  - Individual listing detail screen
  - Edit listing screen
  - Your active listings screen
- Search & Discovery
  - Search results screen
  - Filter / sort options screen
- Profile & Settings
  - Public profile view screen
  - Saved / favorited listings screen

**Other Pages**

- Transaction & Reviews
  - Leave a review screen
  - View all reviews screen
  - Transaction confirmation screen
  - Payment / checkout screen
- Profile & Settings
  - Edit profile screen
  - Transaction history screen
  - Settings screen
- Community Features
  - Community home screen
  - Sub-community browse screen
  - Join community screen
- Utility Screens
  - Error screen
  - Report listing / user screen
  - Help / FAQ screen

# Requirement: GitHub Maintainance
make sure we all have our own branches.
make the git commits clear and useful to avoid confustion.
meet once a week to contribute the same amount of effort.
# Requirement: Project Frontend

Waiting to create wire frame to implement

# Requirement: Project Backend
Data Structure 1: Trie 
The Trie will be used to implement the autocomplete search feature for goods and services posted by UIC students.

I. Usage and Justification
How it's Used: When a user starts typing in the search bar (e.g., "bak..."), the Trie quickly traverses its nodes to find all associated keywords (e.g., "baked goods," "baking," "baklava") that match the prefix and presents them as suggestions.

Why it's Appropriate: The Trie offers extremely fast prefix searching. The search time is proportional only to the length of the word being typed (O(L)), making it ideal for a real-time, responsive autocomplete feature. It also handles the dynamic nature of the platform efficiently, allowing new posts to be added in O(L) time.

Alternatives Considered:

Hash Map: Rejected because finding all keys that start with a prefix is inefficient, requiring us to check every item in the map.

Sorted List: Rejected because while a search could be modified, the necessary O(N) time complexity for insertion (to keep the list sorted) is too slow for a dynamic platform.

II. Data Requirements
Data Source: The database storing the titles and keywords of all active goods and services posts on the platform.

How Data is Pulled:

Initial Load: Upon backend startup, a query pulls all existing post data to construct the initial Trie structure in memory.

Real-Time Updates: An event is triggered every time a new post is successfully created, ensuring the new post's keywords are immediately inserted into the Trie.

Data Processing/Cleaning:

Lowercasing: All extracted text/titles must be converted to lowercase before insertion to ensure case-insensitive searching.

Tokenization: Key terms must be efficiently extracted from post descriptions to populate the Trie with useful keywords.