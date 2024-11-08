# **PetPals: Prototype Game Design Document**

## **Project Overview**

**Description**:

"PetPals" is a virtual pet care web app where users can adopt, care for, and interact with a digital dog. The prototype will focus on essential pet care mechanics, a simple social feed, and a basic walking system. This minimum viable product (MVP) will provide a foundation to expand with advanced features later.

**Platform**:

Progressive Web App (PWA), optimized for mobile and desktop browsers.

---

## **Gameplay and Features**

### **Core Gameplay Mechanics**

1. **Dog Care Basics**
    - **Feeding**: Basic interaction to feed the dog, affecting hunger and happiness stats.
    - **Grooming**: Simple interface for washing and brushing, increasing cleanliness and bonding.
    - **Playtime**: Interact with a toy (like a ball or frisbee), improving happiness and energy.
    - **Health and Happiness Stats**: Basic tracking of the dog’s overall well-being, visible in the UI.
2. **Walking System**
    - **Basic Walking Mode**: A route-based, click-and-go walking system to simulate daily walks, with time-based energy boosts.
    - **Item Collection**: Randomly generate collectible items during walks (e.g., toys, treats) to give users rewards and incentive to walk daily.
3. **Simple Social Feed**
    - **Activity Feed**: Users can see a simple timeline of their pet's activities and achievements, like "Went for a walk!" or "Played with a toy."
    - **Achievements**: Unlockable achievements for milestones, e.g., "First Walk," "10 Days of Care," etc.
4. **Dog Customization**
    - **Basic Appearance Choices**: Choose a dog breed and basic appearance traits (e.g., color, coat pattern) at adoption.
    - **Inventory for Accessories**: Simple inventory system for items found during walks, e.g., a collar, bandana, or toy.

---

## **Game Flow**

1. **Onboarding**
    - New users go through a brief tutorial introducing core mechanics: feeding, grooming, playing, and walking.
2. **Daily Routine**
    - Users perform basic care activities (feeding, grooming, walking) once or twice daily to keep the dog healthy and happy.
3. **Achievements and Milestones**
    - Users unlock achievements through routine care and walking, encouraging daily check-ins.

---

## **Technical Specifications**

### **Frontend**

- **Framework**: **Next.js** with **React** and **TypeScript**
    - Next.js provides server-side rendering (SSR) capabilities for SEO-friendly public pages and better load times.
    - TypeScript offers type safety, especially useful for scalable development.
- **UI and Styling**: **Tailwind CSS**
    - Tailwind CSS for a mobile-responsive and clean design, making it easy to apply quick style changes.
- **State Management**:
    - Use **React Context API** for basic state management of dog stats (health, happiness, energy) and user inventory.

### **Backend**

- **Database**: **Firebase** or **Supabase**
    - Firebase for simple data storage of user profiles, dog stats, and social feed entries.
    - Real-time database capabilities can enable instant updates to stats.
- **Authentication**: Firebase Authentication
    - For user login, allowing multiple devices to sync user data and stats.

### **Core Features and Interactions**

1. **Dog Stats**
    - **Hunger**: Decreases over time; users feed the dog to refill.
    - **Happiness**: Increases with playtime and grooming, decreases if ignored.
    - **Energy**: Increases with rest, decreases with activities like playing or walking.
2. **Simple Inventory System**
    - Users can collect and view items from walks. This includes basics like toys and treats, stored in an inventory.
3. **Simple Achievement Tracking**
    - Track basic achievements that appear in the social feed, such as "First Walk" or "First 7 Days of Care."

---

## **User Interface (UI) / User Experience (UX)**

1. **Home Dashboard**
    - Displays the dog’s core stats (Hunger, Happiness, Energy) in a simple, user-friendly format.
    - Quick access buttons for feeding, grooming, and playing.
2. **Dog Profile and Inventory**
    - Dog profile screen to show basic info, current accessories, and available items in the inventory.
3. **Activity Feed**
    - Simple timeline that shows recent activities and unlocked achievements, providing a light social experience.

---

## **Development Timeline**

1. **Phase 1: Core Functionality**
    - Implement dog adoption, basic dog care (feeding, grooming, playing).
    - Build home dashboard with essential UI and stat-tracking functionality.
2. **Phase 2: Walking and Inventory System**
    - Develop a basic walking mechanic with item collection.
    - Implement inventory system to display collected items.
3. **Phase 3: Social Feed and Achievements**
    - Create a simple social feed to display activities and achievements.
    - Add basic achievement tracking.
4. **Phase 4: Polish and Testing**
    - UI refinement, bug fixes, and performance optimization.
    - Ensure cross-device compatibility (mobile and desktop).

---

## **Future Expansion Ideas**

After the prototype is complete, consider expanding with these additional features:

- **Expanded Dog Interactions**: More toys, tricks, and grooming options.
- **Multiplayer Park Visits**: Allow users to visit virtual parks and interact with friends’ pets.
- **Enhanced AR Integration**: Basic AR capabilities to view the dog in real-world settings.
- **Genetics and Breeding System**: Introduce a simple genetics system to enable puppy generation.