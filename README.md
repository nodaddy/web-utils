# Web Utils Dashboard

This is a dashboard application with user management capabilities for administrators.

## User Management

The user management functionality allows administrators to search for users by email and change their roles. The system enforces the following rules:

1. Only users with the "admin" role can access the user management functionality.
2. Admins can only see and manage users that belong to the same company (have the same `companyId` in their Firebase custom claims).
3. Admins can change user roles to one of the following:
   - admin
   - manager
   - analyst

### How It Works

1. **Authentication**: The application uses Firebase Authentication for user management.
2. **Custom Claims**: User roles and company affiliations are stored as custom claims in Firebase Authentication.
3. **Search**: Admins can search for users by email. The search will only return users with the same `companyId` as the admin.
4. **Role Management**: Admins can change the roles of users in their company using a dropdown menu.

### API Endpoints

The application includes the following API endpoints for user management:

- `GET /api/getUserClaims`: Returns the current user's claims, including `role` and `companyId`.
- `GET /api/searchUsers?email={email}`: Searches for users by email within the admin's company.
- `POST /api/updateUserRole`: Updates a user's role. Requires `userId` and `newRole` in the request body.

### Security

- All API endpoints verify the user's authentication token.
- Role-based access control ensures that only admins can search for users and update roles.
- Company-based isolation ensures that admins can only manage users within their own company.

## Development

### Prerequisites

- Node.js (v14 or later)
- Firebase project with Authentication enabled
- Firebase Admin SDK credentials

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

   FIREBASE_ADMIN_PROJECT_ID=your-project-id
   FIREBASE_ADMIN_CLIENT_EMAIL=your-client-email
   FIREBASE_ADMIN_PRIVATE_KEY=your-private-key
   ```

4. Run the development server: `npm run dev`

## Deployment

The application can be deployed to Vercel or any other Next.js-compatible hosting service.

```bash
npm run build
npm start
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
