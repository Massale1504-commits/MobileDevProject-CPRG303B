# MobileDevProject-CPRG303B

Project Decisions

Architecture Decision Record: Navigation Strategy
Summary
Issue
We need a navigation strategy for our React Native application.
We want users to move quickly and intuitively between calculator features, financial tracking, transaction history, reports, and settings.
The navigation should support future expansion while remaining easy to maintain.

Decision
Decided on React Navigation using Bottom Tab Navigation with Stack Navigation.

Status
Approved.

Details
Assumptions
The application will contain several independent screens.
Users will frequently switch between the Calculator and Finance Tracker.
Some screens (such as transaction details or adding expenses) will be opened temporarily before returning to the previous screen.
The application should follow common Android navigation patterns.

Constraints
React Native does not provide a built-in navigation system.
The navigation library should be well supported and compatible with modern React Native development.
Navigation should remain simple enough for the project timeline.

Positions
We considered Drawer Navigation.
Drawer Navigation works well for applications with many pages, but our app only has a small number of major features. Hiding them behind a menu would require additional taps.

Example:

Menu
- Calculator
- Transactions
- Reports
- Settings

We considered Stack Navigation only.
Stack Navigation is useful for moving forward and backward between screens but makes switching between the calculator and finance tracker inconvenient.
We considered Bottom Tab Navigation.
Bottom tabs allow users to switch between the application's primary features with one tap.
Each tab can also contain its own Stack Navigator for screens such as:

Add Transaction
Transaction Details
Budget Details

Argument
Bottom Tab Navigation provides the fastest access to the application's primary functions.
Combining Bottom Tabs with Stack Navigation follows Android design standards, scales well if additional features are added, and is the most commonly used navigation strategy in React Native.

Implications
Benefits:
Easy navigation between Calculator and Finance Tracker
Familiar Android user experience
Easy to expand
Large community support

Drawbacks:
Slightly more setup than Stack Navigation alone.

Related
Related decisions
Development Framework: React Native

Related requirements
Responsive Android application
Easy navigation
Future scalability

Related artifacts
Navigation components and all application screens.

Related principles
Simplicity
Consistency
Ease of maintenance


Notes
As long as we consider doing the financial portion of the application.


Architecture Decision Record: Hardware
Summary
Issue
Determine which Android hardware features the application will use.

Decision
Use the device's local storage only and do not require specialized hardware.
Optional hardware support:
Camera (future receipt scanning)

Status
Approved.

Details
Assumptions
The calculator works entirely in software.
Financial tracking only requires user-entered information.
Most users expect offline functionality.

Constraints
Additional hardware increases development complexity.
Hardware permissions require additional testing.
Project timeline is limited.

Positions
We considered Camera.
The camera could eventually scan receipts using OCR but is not required for the initial version.

Argument
Avoiding unnecessary hardware keeps the application lightweight and reduces development risk.
The application remains compatible with nearly every Android device while leaving room for future hardware features.

Implications
Benefits:
Fewer permissions requested
Faster development
Better compatibility
Easier testing

Drawbacks:
No biometric login
No receipt scanning in Version 1

Related
Related decisions
React Native
Local database storage

Related requirements
Simple Android application
Reliable offline operation

Related artifacts
Android permissions and React Native native modules.

Related principles
Simplicity
Minimum required functionality

Architecture Decision Record: Database Storage
Summary
Issue
Determine how financial records and calculator history will be stored.

Decision
Decided on encrypted local database storage using SQLite.

Status
Approved.

Details
Assumptions
Users expect their financial data to remain private.
The application should function without an internet connection.
Transaction history should persist after closing the app.

Constraints
Remote databases require authentication and backend services.
Cloud synchronization is outside the scope of the course.
Financial information should not be stored as plain text.

Positions
We considered No Database.
This would cause all transaction data to disappear after closing the application.

We considered Remote Database.
Cloud databases allow synchronization across devices but require internet connectivity, backend development, authentication, and security considerations.

We considered Local Unencrypted Storage.
While simple to implement, storing financial information without encryption creates unnecessary privacy risks.

We considered Encrypted Local SQLite Database.
SQLite is lightweight, reliable, works offline, integrates well with React Native, and can securely store transaction history.

Argument
An encrypted local SQLite database provides the best balance between security, performance, and project scope.
It allows users to access their financial information without internet access while protecting sensitive data.

Implications
Benefits:
Offline functionality
Fast performance
User privacy
Persistent storage
Fits project scope

Drawbacks:
Data is limited to one device.
Cloud synchronization would require future development.

Related
Related decisions
React Native
Hardware choices

Related requirements
Store financial transactions securely
Offline operation
Fast data access

Related artifacts
Transaction database
Budget records
Calculator history

Related principles
Security
Reliability
Offline-first design

Architecture Decision Record: Development Framework
Summary
Issue
We need to choose a development framework for building our mobile application.
We want the application to be fast, responsive, and easy to maintain while supporting future enhancements.
We also want a framework that works well with modern JavaScript and provides access to native Android features when needed.

Decision
Decided on React Native.

Status
Approved.

Details
Assumptions
We are developing a mobile application that combines a calculator with a financial tracking system.
The primary target platform is Android.
The application should provide a responsive and native-like user experience.
Team members are familiar with JavaScript and React concepts.

Constraints
The project must be completed within the course timeline.
The framework should have strong community support and documentation.
The framework should integrate easily with navigation libraries and local database storage.

Positions
We considered Ionic.
Ionic allows rapid development using web technologies and provides many UI components. However, it relies on WebView technology, which may not provide the same native performance or user experience as React Native.

We considered Cordova.
Cordova allows developers to package web applications as mobile apps, but it relies heavily on plugins for native functionality and has become less popular for new projects.

We considered Framework7.
Framework7 provides attractive mobile interfaces and supports hybrid application development. However, it has a smaller community and fewer learning resources than React Native.

We considered NativeScript.
NativeScript provides direct access to native APIs and good performance but has a smaller ecosystem and community compared to React Native.

We considered React Native.
React Native allows developers to build applications using JavaScript and React while rendering native Android components. It has a large community, extensive documentation, strong library support, and integrates well with tools such as React Navigation and SQLite.

Argument

React Native provides the best balance between development speed, performance, and maintainability for our project.
It enables us to reuse JavaScript knowledge while creating a responsive application that behaves like a native Android app. The framework also offers a mature ecosystem, making it easier to implement navigation, local database storage, and future enhancements.

Implications

Benefits
Native-like performance and user experience
Large developer community and extensive documentation
Strong ecosystem of third-party libraries
Easy integration with React Navigation and SQLite
Supports future expansion if additional features are required

Drawbacks
Requires learning React Native-specific APIs and project structure.
Some advanced native functionality may require additional native modules.

Related
Related decisions
Navigation Strategy: React Navigation
Database Storage: Encrypted Local SQLite
Hardware Decisions

Related requirements
Develop a modern Android application
Responsive user interface
Fast application performance
Easy maintenance and future scalability

Related artifacts
React Native project structure
Application components
Mobile user interface

Related principles
Performance
Maintainability
Scalability
Modern mobile development
