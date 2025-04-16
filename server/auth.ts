import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import * as bcrypt from 'bcrypt';
import { User } from '../shared/schema';
import { storage } from './storage';
import { log } from './vite';

export function setupAuth() {
  // Serialize user into the session
  passport.serializeUser<any>((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser<any>(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(new Error('User not found'));
      }
      
      // Remove sensitive data before returning user
      const { password, ...userWithoutPassword } = user;
      done(null, userWithoutPassword);
    } catch (error) {
      done(error);
    }
  });

  // Configure local strategy (username/password)
  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      log(`Authenticating user: ${username}`, 'auth');
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        log(`User not found: ${username}`, 'auth');
        return done(null, false, { message: 'Incorrect username.' });
      }
      
      // Compare passwords
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        log(`Password mismatch for user: ${username}`, 'auth');
        return done(null, false, { message: 'Incorrect password.' });
      }
      
      // Update last login timestamp
      await storage.updateUserLastLogin(user.id);
      
      log(`User authenticated successfully: ${username}`, 'auth');
      return done(null, user);
    } catch (error) {
      log(`Authentication error: ${error}`, 'auth');
      return done(error);
    }
  }));

  return passport;
}

// Middleware to check if user is authenticated
export function isAuthenticated(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ success: false, message: 'Not authenticated' });
}

// Middleware to check if user is an admin
export function isAdmin(req: any, res: any, next: any) {
  // For development: bypass authentication check
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment) {
    return next();
  }
  
  // For production
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Not authorized' });
}

// Middleware to check if user is an admin or manager
export function isAdminOrManager(req: any, res: any, next: any) {
  // For development: bypass authentication check
  const isDevelopment = process.env.NODE_ENV === 'development';
  if (isDevelopment) {
    return next();
  }
  
  // For production
  if (req.isAuthenticated() && (req.user.role === 'admin' || req.user.role === 'manager')) {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Not authorized' });
}

// Middleware to check if user is staff (any role)
export function isStaff(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ success: false, message: 'Not authenticated' });
}