# GDPR Cookie Consent System

This document explains how the GDPR-compliant cookie consent system works in the Paris Yolcusu website.

## Overview

The cookie consent system provides a way for users to control what third-party scripts and cookies are loaded on the website. The system follows these principles:

1. By default, no third-party scripts are loaded when a user first visits the site
2. A consent banner is shown to the user, offering options to:
   - Accept all cookies
   - Reject all cookies
   - Customize their preferences
3. Scripts are only loaded after the user has given explicit consent
4. Users can change their preferences at any time

## Components

The system consists of the following components:

### 1. Context Provider (`CookieConsentContext.tsx`)

- Manages the consent state (analytics, marketing, functional)
- Provides methods to update consent preferences
- Persists preferences to localStorage

### 2. Consent Banner (`CookieConsentBanner.tsx`)

- Displayed at the bottom of the page when a user hasn't interacted with the consent options
- Offers buttons to accept all, reject all, or customize preferences

### 3. Preferences Modal (`CookiePreferencesModal.tsx`)

- Allows fine-grained control over consent categories
- Provides information about each cookie category

### 4. Conditional Script Loader (`ConditionalScripts.tsx`)

- Only loads scripts if the user has given consent for the relevant category
- Currently manages the Google Tag Manager script (which loads other scripts)

### 5. Cookie Policy Pages

- Detailed information about cookie usage in multiple languages
- Accessible via the footer link

### 6. Preferences Manager (`CookieConsentManager.tsx`)

- Button in the footer to re-open the preferences modal

## How It Works

1. When a user visits the site, the `CookieConsentProvider` initializes with default preferences (all off)
2. The `CookieConsentBanner` is displayed at the bottom of the page
3. No third-party scripts are loaded until consent is given
4. When the user makes a choice, their preferences are stored in localStorage
5. The `ConditionalScripts` component only loads the Google Tag Manager if the user has consented to analytics or marketing
6. Users can change their preferences at any time by clicking the "Cookie Preferences" link in the footer

## Managing Third-Party Scripts

Currently, all third-party scripts are managed through Google Tag Manager. The `ConditionalScripts.tsx` component only loads GTM if the user has given consent for analytics or marketing.

If you need to add additional scripts that are not managed by GTM, you can add them to the appropriate sections in the `ConditionalScripts.tsx` file.

## Customization

To customize the consent categories or the appearance of the banner/modal, you can modify the following files:

- `CookieConsentContext.tsx` - To change consent categories
- `CookieConsentBanner.tsx` - To change the appearance of the banner
- `CookiePreferencesModal.tsx` - To change the appearance of the preferences modal
- `ConditionalScripts.tsx` - To change which scripts are loaded based on consent

## Compliance

This implementation aims to comply with GDPR requirements by:

1. Not loading cookies without explicit consent
2. Providing clear information about cookie usage
3. Allowing users to choose which categories of cookies they accept
4. Providing a way to change preferences at any time
5. Including a detailed cookie policy 