import { z } from 'zod';

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const ProjectSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  description: z.string().optional(),
});

export const PublishConfigSchema = z.object({
  fullWebsiteUrl: z.string().url().optional().or(z.literal('')),
  customDomain: z.string().optional().or(z.literal('')),
  subdomain: z.string().optional().or(z.literal('')),
  urlSlug: z.string().optional().or(z.literal('')),
  projectName: z.string().optional().or(z.literal('')),
  appName: z.string().optional().or(z.literal('')),
  androidPackageName: z.string().optional().or(z.literal('')),
  iosBundleIdentifier: z.string().optional().or(z.literal('')),
  websiteTitle: z.string().optional().or(z.literal('')),
  seoTitle: z.string().optional().or(z.literal('')),
  metaDescription: z.string().optional().or(z.literal('')),
  keywords: z.string().optional().or(z.literal('')),
  logoUrl: z.string().url().optional().or(z.literal('')),
  splashScreenUrl: z.string().url().optional().or(z.literal('')),
  iconUrl: z.string().url().optional().or(z.literal('')),
  themeColor: z.string().regex(/^#([0-9a-fA-F]{3}){1,2}$/, "Invalid hex color").optional().or(z.literal('')),
  privacyPolicyUrl: z.string().url().optional().or(z.literal('')),
  termsConditionsUrl: z.string().url().optional().or(z.literal('')),
});
