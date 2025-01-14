import { supabase } from './supabase';

export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error: any) {
    console.error('Sign out error:', error);
    return { error };
  }
};

export const signInUser = async (email: string, password: string) => {
  try {
    const { error } = await supabase.auth.signInWithPassword({ 
      email: email.trim(), 
      password 
    });
    
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        throw new Error('The email or password you entered is incorrect. Please check your credentials and try again.');
      }
      if (error.message.includes('Email not confirmed')) {
        throw new Error('Please verify your email before signing in. Check your inbox for the verification link.');
      }
      throw error;
    }
    
    return { error: null };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return { error };
  }
};

export const signUpUser = async (email: string, password: string) => {
  try {
    const { error, data } = await supabase.auth.signUp({ 
      email: email.trim(), 
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });
    
    if (error) throw error;
    
    if (data.user?.identities?.length === 0) {
      throw new Error("Email already registered");
    }
    
    return { error: null, data };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return { error };
  }
};