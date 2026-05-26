# Phase 1 Setup Instructions

## What was built in Phase 1:

1. **Expo project initialized** with TypeScript and basic structure
2. **Supabase client configured** (`src/lib/supabase.ts`)
3. **Zustand auth store created** (`src/stores/authStore.ts`)
4. **TypeScript types defined** (`src/types/index.ts`)
5. **Navigation structure set up**:
   - Auth screen with email/password + Google OAuth
   - Tab navigation (Shop, Cart, Orders, Profile)
6. **Supabase schema provided** (`supabase-schema.sql`)

## YOUR NEXT STEPS (Do these before proceeding):

### Step 1: Create Supabase Project
1. Go to https://supabase.com and create a free account
2. Create a new project (name it "Wishlist" or similar)
3. Wait for the project to be ready (2-3 minutes)

### Step 2: Run the Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-schema.sql` from this project
3. Paste it into the SQL Editor and click **Run**
4. This creates: `products`, `profiles`, `promotions`, `orders` tables

### Step 3: Configure Authentication
1. In Supabase dashboard, go to **Authentication > Settings**
2. Enable **Email** provider (should be on by default)
3. Enable **Google** provider:
   - You'll need Google OAuth credentials (follow Supabase docs)
   - Or skip Google for now and just use email/password

### Step 4: Get Your API Keys
1. In Supabase dashboard, go to **Project Settings > API**
2. Copy the **URL** and **anon/public key**
3. Open `src/lib/supabase.ts` in your project
4. Replace the placeholder values:
   ```typescript
   const SUPABASE_URL = 'https://your-actual-project-id.supabase.co';
   const SUPABASE_ANON_KEY = 'your-actual-anon-key';
   ```

### Step 5: Update Google OAuth Redirect
1. In `src/stores/authStore.ts`, find the `signInWithGoogle` function
2. Replace `'yourapp://auth/callback'` with your actual app scheme
3. For Expo, use something like `'exp://192.168.1.x:8081'` for development

### Step 6: Test the App
```bash
npm start
# or
npx expo start
```
- Open in Android/iOS simulator or use Expo Go on your phone
- Try signing up with email/password
- Check Supabase dashboard > Table Editor > profiles to see if user was created

## Files Created in Phase 1:
```
/app
  _layout.tsx                    ← Root navigation layout
  (auth)/index.tsx                ← Login/Signup screen
  (tabs)/_layout.tsx             ← Tab navigator
  (tabs)/shop/index.tsx          ← Shop tab (placeholder)
  (tabs)/cart/index.tsx          ← Cart tab (placeholder)
  (tabs)/orders/index.tsx        ← Orders tab (placeholder)
  (tabs)/profile/index.tsx       ← Profile tab with logout

/src
  /lib/supabase.ts               ← Supabase client config
  /stores/authStore.ts           ← Zustand auth store
  /types/index.ts                ← TypeScript interfaces

supabase-schema.sql              ← Database schema to run in Supabase
PHASE1_SETUP.md                  ← This file
```

## Ready to proceed?
Once you've completed the steps above and successfully:
- Created a Supabase project
- Run the SQL schema
- Updated the API keys in `src/lib/supabase.ts`
- Tested that signup/login works

**Tell me "Phase 1 complete" and I'll proceed to Phase 2: Product Listing Screen**
