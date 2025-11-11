# Requirement: Backend & API Integration

**Jessie:**
- Connect the individual item listing page to the backend.
- Create a new API endpoint to fetch all items associated with a specific user. This will be used to populate the listings section on their public profile.

**Rei:**
- Implement the backend endpoint for creating a new listing.
- This endpoint must receive form data from the "Create Listing" page (title, description, price, category_id, seller_id, etc.) and create a new record in the `items` database table.

# Requirement: Frontend Development

**Jessie:**
- Implement the frontend logic on the `Profile.tsx` page to display the new "Listings" section.
- This will involve fetching data from the new endpoint and using `ProductCard` components to render a grid of the user's active listings.

**Rei:**
- Continue building the "Create Listing" page component in React.
- This includes creating the full web form with inputs for title, description, price, quantity, and category selection.
- Implement the client-side logic to handle form state and submit the data to the new backend endpoint.