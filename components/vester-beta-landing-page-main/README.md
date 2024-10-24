# Vester Beta Landing Page

### Overview
This repo creates an interactive 3D event badge using React-Three-Fiber and Rapier physics. Users can drag the badge, which is connected to a band, and the badge responds dynamically to movements. The project is part of a landing page for a beta sign-up for Vester.

### Project Structure
- **App.js**: Main application structure, handling UI, Canvas rendering, and form logic.
- **Components/Band.js**: Manages the 3D badge and band interactions.
- **styles.css**: Contains styles for the landing page.

### Detailed Explanation

#### 3D Model and Physics
The 3D model and physics interactions are handled using `react-three-fiber`, `@react-three/drei`, and `@react-three/rapier`. The models for the badge and metal clip were built in Blender and loaded into the Band.js component. The actual band part of the model is built within the code along with its physics and has a leather texture image mapped onto its surface.

Starting in ```App.js```, The Canvas component creates the WebGL context and manages rendering. It acts as the main area where the 3D scene is rendered.
The camera is positioned and given a field of view (fov) for perspective.
Ambient lighting is added to provide uniform lighting across the scene.
The Physics component then sets up the physics environment, defining gravity and other physical interactions. The Suspense component from React ensures that the 3D model is only rendered after it has fully loaded, improving performance and preventing rendering issues. The Band component is wrapped in Suspense to leverage this functionality.

The Environment component from @react-three/drei sets up an environment map for lighting and reflections.
Various Lightformer components are added to enhance the lighting and create realistic reflections and highlights on the 3D objects.


- Band.js: This component manages the 3D badge and band interactions. It uses various hooks from react-three-fiber to render the 3D models and manage animations.
    - useGLTF and useTexture: These hooks preload the 3D model and texture.
    - useRopeJoint and useSphericalJoint: These hooks create the joints for the band and the badge, allowing for realistic physics-based interactions.
    - useFrame: This hook is used to update the positions and rotations of the badge and band in every frame, creating smooth animations.
    - meshLineGeometry and meshLineMaterial: These are used to render the band as a line with a texture.  

Physical properties such as angular damping and linear damping are set to control how the objects behave in the simulation. The band’s position is updated based on user dragging and
a Catmull-Rom curve is used to smoothly interpolate between points on the band, ensuring everything looks natural and fluid.

![Blender Screenshot](/public/3d-model-ss.png)

#### Form Submission

When the page loads, the user is prompted with some welcome messages, links to Vester social media pages, and a button to sign up for the Beta. When the button is clicked, a form slides into the page that lets the user input their name, email, and where they heard about the Vester beta (which are all required fields). Once submitted, a confirmation message is rendered and the form data is saved. Currently, the data is sent to a google sheet and an attached app script (seen below via links) which uses the form values to send out confirmation emails from 'contact@vesterai.com'. The app script is an extension of the sheet and is deployed as a web app with a link that ```App.js``` sends the form data to. When the app script receives the data, it writes it to the sheet as a new row and sends the email message using the 'Name' and 'Email' fields. This is just an initial implementation of email notifications using google's built in email functionality, so it can be changed out easily. 

- ##### Form Handling:
    - The form is displayed when the user clicks the "RESERVE YOUR SPOT" button.
    - On form submission, an asynchronous function handleFormSubmit sends the data to the Google Apps Script web app.
    - If the form submission is successful, a confirmation message is displayed.  

- ##### Form Data Fields:
    1. Name
    2. Email
    3. Source (Where the user heard about Vester and our beta release)


#### Google App Script Code

```
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Form Responses'); 
  var params = e.parameter;
  sheet.appendRow([params.name, params.email, params.source]);

  // Send an email notification
  var emailAddress = params.email; // The email address entered in the form
  var subject = 'Thank you for signing up!';
  var message = 'Dear ' + params.name + ',\n\n' +
                'Thank you for signing up for the Vester Beta. We will keep you updated with the latest information.\n\n' +
                'Best regards,\nThe Vester Team';
  
  MailApp.sendEmail(emailAddress, subject, message);

  return ContentService.createTextOutput('Success');
}
```

#### Google Sheets/Script
https://docs.google.com/spreadsheets/d/1et1AeMk3UqYu_2zd8iyujRoPCQVa3zdqtSc4n2Ngn9o/edit?usp=sharing

### Demo
Adding soon...

### Next Steps
1. Storing Sign-Up Data: Implement functionality to store sign-up data in a database and in a form that can be easily integrated into the data model.
2. Hosting the Page: Prepare and deploy the application to send out to potential beta users.

### Installation
1. Clone the repository
2. Install dependencies: ```npm install```
3. Start the development server: ```npm start```

### References
- https://www.designspells.com/spells/digital-badge-and-lanyard-for-virtual-attendees-of-vercels-conference
- https://vercel.com/blog/building-an-interactive-3d-event-badge-with-react-three-fiber
