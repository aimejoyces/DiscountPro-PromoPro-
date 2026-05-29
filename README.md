## Dynamic Discount & Coupon Engine E-Commerce App

### Project Overview

This project is a fully functional e-commerce mobile application built using React Native and Expo SDK 52+. The application focuses on implementing a **Dynamic Discount & Coupon Engine** capable of handling multiple promotional rules, stackable discounts, tiered pricing, and conflict resolution during checkout. The system is designed to simulate real-world e-commerce promotional logic while maintaining performance, scalability, and user-friendly interaction.

---

## Project Track

### Dynamic Discount & Coupon Engine [Medium-Hard]

The application includes a rule-based checkout system supporting:

* Stackable coupon discounts
* Tiered pricing promotions
* Buy 2 Get 1 Free offers
* Spend-based percentage discounts
* Promotion conflict resolution
* Flash sale override logic
* Time-gated promotional rules

---

# Core Algorithm

The core feature of this project is a **Rule Engine** that processes and evaluates multiple promotions simultaneously.

## Algorithm Used

The application uses:

* Priority Queue Logic
* Greedy Algorithm Selection
* Conflict Resolution System

---

# Flash Sale Override Feature

A special **Flash Sale Rule** overrides all other discounts during a specific time window.

### Conditions (EXAMPLE)

* Active only between **12:00 PM – 2:00 PM**
* Automatically disables all other promotions
* Applies highest-priority flash sale discount

This feature demonstrates dynamic rule injection and real-time promotion handling.
---

# Navigation Patterns

The application uses Expo Router with the following navigation patterns:

* Tabs Navigation
* Stack Navigation
* Modal Navigation
* Drawer Navigation

---

# Local Persistence

The application uses:

* SQLite / AsyncStorage

### Stored Data

* Cart items
* User preferences
* Cached product data
* Checkout drafts

---

# Features (EXAMPLE)

## User Features

* User registration and login
* Browse product catalog
* Search and filter products
* Add to cart
* Wishlist management
* Checkout system
* Apply coupons and discounts
* Order summary and receipt

## Admin Features

* Manage products
* Add promotions
* Configure discount rules
* Monitor flash sale events

---

# Git Workflow

Development follows a proper GitHub workflow:

* Feature branches
* Pull requests
* Meaningful commit messages
* Version tracking

---

# EXAMPLE Promotions

| Promotion Type      | Example                   |
| ------------------- | ------------------------- |
| Buy X Get Y         | Buy 2 Get 1 Free          |
| Percentage Discount | 10% Off                   |
| Spend Threshold     | Spend ₱500 Get 10% Off    |
| Flash Sale          | 50% Off from 12 PM – 2 PM |

---

# Developers

Developed by:

* [GASCON, Aiene Berfel Sym]
* [SARITA, Aime Joyce]

Course Requirement – Mobile Application Development

---

# Conclusion

This project demonstrates the implementation of advanced e-commerce promotional logic using React Native and modern mobile development technologies. The application combines algorithmic problem-solving, responsive UI/UX, backend integration, and optimized performance into a complete mobile commerce solution.

## Link:
https://drive.google.com/drive/folders/1hDm9gK5eeHXv2XM69jTDgn35mvuAWBCH?usp=sharing
