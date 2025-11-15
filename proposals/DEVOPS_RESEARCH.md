# DevOps Research & Recommendations for Keyston

## Executive Summary

This document provides comprehensive research on automated DevOps solutions for Keyston, focusing on **free or low-cost options** suitable for a one-person hobby project. The recommendations prioritize GitHub Actions for CI/CD automation and explore various free hosting options for web deployment, future backend services, and database needs.

**Key Recommendations**:
- ✅ **CI/CD**: GitHub Actions (free for public repos)
- ✅ **Web Hosting**: GitHub Pages, Netlify, or Vercel (all free)
- ✅ **Backend Hosting**: Railway, Render, or Fly.io (free tiers)
- ✅ **Database**: Supabase, PlanetScale, or Neon (free tiers)
- ✅ **CDN**: Cloudflare (free tier)

---

## Table of Contents

1. [Project Context](#1-project-context)
2. [CI/CD Solutions](#2-cicd-solutions)
3. [Web Hosting Options](#3-web-hosting-options)
4. [Backend Hosting Solutions](#4-backend-hosting-solutions)
5. [Database Hosting Options](#5-database-hosting-options)
6. [Recommended DevOps Architecture](#6-recommended-devops-architecture)
7. [Implementation Guide](#7-implementation-guide)
8. [Cost Analysis](#8-cost-analysis)
9. [Comparison Tables](#9-comparison-tables)

---

## 1. Project Context

### 1.1 Current State

**Keyston** is a privacy-first fitness and health tracking mobile application built with:
- **Framework**: Ionic + React + TypeScript
- **Architecture**: Offline-first, no backend (currently)
- **Storage**: IndexedDB (client-side)
- **Target Platforms**: iOS, Android, Web (PWA)
- **Current Deployment**: Local development only

### 1.2 DevOps Requirements

Based on the issue requirements:

1. **Automated Deployment**: Easy deployment from GitHub to production
2. **Web Hosting**: Public URL for testing and demos
3. **Free/Low-Cost**: Single developer, hobby project constraints
4. **GitHub Actions**: Preferred for CI/CD automation
5. **Future-Ready**: Support for backend API and database expansion
6. **Testing Environment**: Easy access for stakeholders and testers

### 1.3 Privacy-First Considerations

While the app currently has **no backend**, future plans include:
- Custom food database API
- User accounts system
- Data synchronization services

DevOps solutions must support this evolution while maintaining privacy commitments.

---

## 2. CI/CD Solutions

### 2.1 GitHub Actions (RECOMMENDED)

**Overview**: GitHub's built-in CI/CD platform, integrated directly into repositories.

#### Pros ✅
- **Free for Public Repos**: Unlimited minutes for public repositories
- **Free for Private Repos**: 2,000 minutes/month on free plan
- **Native Integration**: Built into GitHub, no external setup
- **Matrix Builds**: Test across multiple environments simultaneously
- **Marketplace**: 10,000+ pre-built actions available
- **Self-Hosted Runners**: Option to use your own hardware
- **Secrets Management**: Encrypted environment variables
- **Caching**: Speed up builds with dependency caching
- **Artifact Storage**: Store build outputs for deployment

#### Cons ❌
- **Learning Curve**: YAML syntax and workflow design
- **Limited Free Storage**: 500 MB artifacts storage (free tier)
- **Compute Limits**: 2,000 minutes/month for private repos

#### Use Cases for Keyston
1. **Automated Testing**: Run lint, unit tests, and e2e tests on every PR
2. **Build Automation**: Build web, iOS, and Android versions
3. **Deployment**: Auto-deploy to web hosting on main branch push
4. **Release Management**: Create GitHub releases with built artifacts
5. **Dependency Updates**: Automated Dependabot PRs with CI checks

#### Cost Analysis
- **Public Repo**: $0/month (unlimited)
- **Private Repo**: $0/month (2,000 minutes included)
- **Additional Minutes**: $0.008/minute if exceeded (unlikely for small project)

**Verdict**: ⭐⭐⭐⭐⭐ **Perfect fit** - Free, integrated, and powerful

---

### 2.2 Alternative CI/CD Options

#### CircleCI

**Pros**:
- Free tier: 6,000 build minutes/month
- Docker support
- Parallel builds
- Good documentation

**Cons**:
- External service (less integrated than GitHub Actions)
- Free tier limits can be restrictive
- Requires separate account

**Cost**: Free tier available, then $15/month

**Verdict**: ⭐⭐⭐ Good alternative if GitHub Actions insufficient

---

#### Travis CI

**Pros**:
- Historically popular
- Good GitHub integration
- Build matrix support

**Cons**:
- **No longer free for new users** (as of 2021)
- Starting at $69/month
- Less competitive than alternatives

**Cost**: $69/month minimum

**Verdict**: ⭐ Not recommended - no free tier

---

#### GitLab CI/CD

**Pros**:
- 400 minutes/month free
- Integrated with GitLab
- Docker registry included
- Kubernetes integration

**Cons**:
- Requires migration from GitHub
- 400 minutes less generous than GitHub Actions
- Separate platform to manage

**Cost**: Free tier (400 min/month), then $19/user/month

**Verdict**: ⭐⭐ Not recommended - requires leaving GitHub

---

### 2.3 Recommended CI/CD: GitHub Actions

**Why GitHub Actions wins**:
1. Already using GitHub for version control
2. Free unlimited minutes for public repos
3. Native integration with pull requests
4. Extensive marketplace of pre-built actions
5. Easy to get started with workflow templates
6. Built-in secrets management
7. Matrix testing across platforms
8. Artifact storage for build outputs

---

## 3. Web Hosting Options

For deploying the Ionic React web app (PWA) for testing and demos.

### 3.1 GitHub Pages (RECOMMENDED for Simple Static Sites)

**Overview**: Free static site hosting directly from GitHub repositories.

#### Pros ✅
- **Completely Free**: Unlimited bandwidth (fair use)
- **Zero Configuration**: Works out of the box with GitHub Actions
- **Custom Domain**: Free SSL with custom domain support
- **Fast**: CDN-backed
- **GitHub Integration**: Deploy from workflow automatically
- **Simple**: Perfect for static sites

#### Cons ❌
- **Static Only**: No server-side logic
- **Build Step Required**: Need to build Ionic app first
- **Limited Features**: No preview deployments for PRs
- **Storage**: 1 GB soft limit

#### Setup Process
```yaml
# .github/workflows/deploy.yml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./build
```

#### URL Format
- Default: `https://<username>.github.io/<repo-name>`
- Custom: `https://keyston.app` (with custom domain)

**Cost**: $0/month

**Verdict**: ⭐⭐⭐⭐⭐ **Best for simple deployments**

---

### 3.2 Netlify (RECOMMENDED for Advanced Features)

**Overview**: Modern hosting platform for static sites and serverless functions.

#### Pros ✅
- **Free Tier**: 100 GB bandwidth/month
- **Preview Deployments**: Automatic preview URLs for every PR
- **Custom Domains**: Free SSL certificates
- **Forms**: Built-in form handling (no backend needed)
- **Serverless Functions**: 125,000 function calls/month free
- **Redirects & Rewrites**: SPA routing support
- **Split Testing**: A/B testing built-in
- **Deploy Previews**: Test changes before merging
- **Analytics**: Basic analytics included (paid)
- **Edge Functions**: Serverless at the edge

#### Cons ❌
- **Build Time**: 300 minutes/month (usually sufficient)
- **Team Features**: Limited on free tier
- **Analytics**: Requires paid plan ($9/month)

#### Features Perfect for Keyston
1. **SPA Routing**: Handles React Router seamlessly
2. **Preview Deployments**: Test every PR before merging
3. **Forms**: Contact forms without backend
4. **Serverless Functions**: Future API endpoints (Node.js)
5. **Environment Variables**: Per-deployment configs

#### Setup Process
1. Connect GitHub repo to Netlify
2. Configure build command: `npm run build`
3. Set publish directory: `build/`
4. Automatic deployments on every push

**Cost**: $0/month (free tier)

**Verdict**: ⭐⭐⭐⭐⭐ **Best overall for Ionic/React apps**

---

### 3.3 Vercel (RECOMMENDED for Next.js/React)

**Overview**: Frontend cloud platform optimized for React and Next.js.

#### Pros ✅
- **Free Tier**: 100 GB bandwidth/month
- **Preview Deployments**: Automatic preview for PRs
- **Edge Network**: Global CDN
- **Serverless Functions**: Built-in API routes support
- **Zero Config**: Auto-detects React/Ionic
- **Custom Domains**: Free SSL
- **Fast Builds**: Optimized for React frameworks
- **Monitoring**: Basic analytics included

#### Cons ❌
- **Optimized for Next.js**: Some features specific to Next.js
- **Function Timeout**: 10 seconds on free tier
- **Build Time**: 6,000 minutes/month (generous)

#### Features for Keyston
1. **React Optimizations**: Built for React apps
2. **API Routes**: Serverless functions for future backend
3. **Preview URLs**: Test before production
4. **Fast Deployments**: Edge network

**Cost**: $0/month (free tier)

**Verdict**: ⭐⭐⭐⭐⭐ **Excellent for React/Ionic**

---

### 3.4 Cloudflare Pages

**Overview**: Static site hosting on Cloudflare's global network.

#### Pros ✅
- **Unlimited Bandwidth**: No bandwidth limits
- **Unlimited Requests**: No request limits
- **Preview Deployments**: PR previews
- **Fast**: Cloudflare's CDN network
- **Free**: Generous free tier
- **Custom Domains**: Free SSL

#### Cons ❌
- **Build Limitations**: 500 builds/month
- **Newer Service**: Less mature than Netlify/Vercel
- **Documentation**: Still evolving

**Cost**: $0/month

**Verdict**: ⭐⭐⭐⭐ **Great alternative with unlimited bandwidth**

---

### 3.5 Firebase Hosting

**Overview**: Google's hosting solution, part of Firebase platform.

#### Pros ✅
- **Free Tier**: 10 GB storage, 360 MB/day transfer
- **Google Integration**: Easy integration with other Firebase services
- **Custom Domains**: Free SSL
- **Rollback**: Easy rollback to previous deployments
- **CDN**: Fast global delivery

#### Cons ❌
- **Bandwidth Limits**: Only 360 MB/day (restrictive)
- **Google Dependency**: Locked into Google ecosystem
- **Overkill**: Too many features for simple static hosting

**Cost**: $0/month (free tier)

**Verdict**: ⭐⭐⭐ **Good if using Firebase ecosystem, otherwise overkill**

---

### 3.6 Comparison: Web Hosting

| Feature | GitHub Pages | Netlify | Vercel | Cloudflare Pages | Firebase |
|---------|-------------|---------|--------|------------------|----------|
| **Bandwidth** | Unlimited* | 100 GB/mo | 100 GB/mo | Unlimited | 360 MB/day |
| **Build Minutes** | Via Actions | 300/mo | 6,000/mo | 500/mo | N/A |
| **PR Previews** | ❌ | ✅ | ✅ | ✅ | ❌ |
| **Custom Domain** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Free SSL** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Functions** | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Ease of Setup** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Best For** | Simple | Feature-rich | React apps | Unlimited traffic | Firebase users |

### 3.7 Recommended: Netlify or Vercel

**Primary Choice**: **Netlify**
- Preview deployments for every PR (critical for testing)
- More generous free tier than GitHub Pages
- Serverless functions for future API needs
- Built-in form handling

**Alternative**: **Vercel**
- Similar features to Netlify
- Optimized for React/Next.js
- Excellent developer experience

**Fallback**: **GitHub Pages**
- Simplest option
- Good for basic static hosting
- No PR previews (limitation)

---

## 4. Backend Hosting Solutions

For future Node.js backend API and custom food database.

### 4.1 Railway (RECOMMENDED)

**Overview**: Modern platform for deploying backend applications with minimal config.

#### Pros ✅
- **Free Tier**: $5 credit/month (sufficient for small apps)
- **PostgreSQL**: Free database included
- **Zero Config**: Auto-detects Node.js apps
- **GitHub Integration**: Auto-deploy from repo
- **Logging**: Built-in logs and monitoring
- **Environment Variables**: Easy secrets management
- **Custom Domains**: Free SSL
- **Scaling**: Easy to scale when needed
- **Docker Support**: Custom containers

#### Cons ❌
- **Limited Free Tier**: $5/month credit (runtime limits)
- **Requires Credit Card**: For verification (no charge on free tier)
- **Newer Service**: Less established than Heroku

#### Perfect for Keyston Because:
1. **Easy Node.js Deployment**: No configuration needed
2. **Database Included**: PostgreSQL for food database
3. **GitHub Auto-Deploy**: Push to deploy
4. **Monitoring**: Built-in logs and metrics

#### Cost Breakdown
- **Free**: $5/month credit (500 hours execution)
- **Paid**: Pay-as-you-go after free credit
- **Database**: Included in free tier

**Cost**: $0/month (within free tier)

**Verdict**: ⭐⭐⭐⭐⭐ **Best for small Node.js backends**

---

### 4.2 Render (RECOMMENDED)

**Overview**: Unified platform for web services, static sites, and databases.

#### Pros ✅
- **Free Tier**: Free web service (with limitations)
- **PostgreSQL**: Free database (90 days retained)
- **Auto-Deploy**: GitHub integration
- **Custom Domains**: Free SSL
- **Environment Variables**: Secrets management
- **Logging**: Real-time logs
- **Health Checks**: Built-in monitoring
- **Docker Support**: Custom containers

#### Cons ❌
- **Spin Down**: Free tier services sleep after 15 min inactivity
- **Cold Starts**: 30-60 second startup time
- **Database Limits**: 1 GB storage, expires after 90 days
- **Build Time**: 500 minutes/month

#### Use Cases
1. **API Backend**: Node.js/Express API
2. **Cron Jobs**: Scheduled tasks
3. **Static Sites**: Alternative to Netlify
4. **Docker Apps**: Custom containers

**Cost**: $0/month (free tier)

**Verdict**: ⭐⭐⭐⭐ **Good free option with database**

---

### 4.3 Fly.io

**Overview**: Deploy apps close to users with global edge network.

#### Pros ✅
- **Free Tier**: 3 shared VMs, 160 GB bandwidth/month
- **Docker-Based**: Deploy any language/framework
- **Global Edge**: Deploy close to users
- **PostgreSQL**: Free managed database
- **Custom Domains**: Free SSL
- **Scaling**: Easy horizontal scaling

#### Cons ❌
- **Docker Required**: Must containerize apps
- **Complexity**: More complex than Railway/Render
- **Limited Free Tier**: Only 3 VMs

#### Best For
- Docker-experienced developers
- Apps requiring global edge deployment
- Microservices architecture

**Cost**: $0/month (within free tier)

**Verdict**: ⭐⭐⭐⭐ **Powerful but requires Docker knowledge**

---

### 4.4 Heroku (Legacy Option)

**Overview**: Pioneer in platform-as-a-service, now owned by Salesforce.

#### Pros ✅
- **Mature Platform**: Battle-tested
- **Add-ons**: Rich ecosystem
- **Documentation**: Extensive

#### Cons ❌
- **NO FREE TIER** (as of November 2022)
- **Minimum Cost**: $5/month for basic dyno
- **Expensive**: Not suitable for hobby projects

**Cost**: $5/month minimum

**Verdict**: ⭐⭐ **Not recommended - no longer free**

---

### 4.5 Supabase Edge Functions

**Overview**: Serverless functions integrated with Supabase backend.

#### Pros ✅
- **Free Tier**: 500,000 invocations/month
- **Deno-Based**: Modern TypeScript runtime
- **Database Integration**: Direct access to Supabase PostgreSQL
- **Low Latency**: Edge deployment

#### Cons ❌
- **Deno Only**: Not Node.js (different ecosystem)
- **Supabase Lock-in**: Tied to Supabase platform
- **Beta**: Still in development

**Cost**: $0/month

**Verdict**: ⭐⭐⭐ **Good if using Supabase, otherwise niche**

---

### 4.6 Comparison: Backend Hosting

| Platform | Free Tier | Database | Auto-Deploy | Cold Start | Docker | Best For |
|----------|-----------|----------|-------------|------------|--------|----------|
| **Railway** | $5 credit/mo | PostgreSQL ✅ | ✅ | No | ✅ | Node.js apps |
| **Render** | ✅ (sleeps) | PostgreSQL ✅ | ✅ | Yes (60s) | ✅ | Budget projects |
| **Fly.io** | 3 VMs | PostgreSQL ✅ | ✅ | No | ✅ Required | Edge apps |
| **Heroku** | ❌ None | Add-ons | ✅ | No | ✅ | N/A (paid only) |
| **Supabase** | 500k/mo | PostgreSQL ✅ | ✅ | No | ❌ Deno | Supabase users |

### 4.7 Recommended: Railway

**Why Railway wins for Keyston**:
1. **Easy Setup**: Zero-config Node.js deployment
2. **Free Database**: PostgreSQL included for food database
3. **No Cold Starts**: Always-on in free tier
4. **GitHub Integration**: Auto-deploy on push
5. **Simple Pricing**: Clear credit-based system
6. **Good for MVP**: Perfect for testing and early users

**Alternative**: **Render** (if $5/month Railway credit runs out)

---

## 5. Database Hosting Options

For future custom food database and user data storage.

### 5.1 Supabase (RECOMMENDED)

**Overview**: Open-source Firebase alternative with PostgreSQL backend.

#### Pros ✅
- **Free Tier**: 500 MB database, 2 GB bandwidth/month
- **PostgreSQL**: Full-featured relational database
- **Real-time**: Built-in real-time subscriptions
- **Authentication**: User auth included
- **Storage**: File storage included (1 GB)
- **Auto API**: Auto-generated REST and GraphQL APIs
- **Row Level Security**: Built-in security
- **Serverless Functions**: Edge functions included
- **Dashboard**: Web-based database management
- **Backups**: Automated backups on paid tiers

#### Cons ❌
- **Storage Limits**: 500 MB on free tier
- **Paused Projects**: Inactive projects paused after 1 week
- **Bandwidth**: 2 GB/month transfer limit

#### Perfect for Keyston Because:
1. **PostgreSQL**: Perfect for food database (structured data)
2. **Auto API**: REST API generated from schema
3. **Authentication**: Built-in user management
4. **Real-time**: Sync data between devices
5. **TypeScript Support**: Excellent TypeScript types

#### Use Cases
1. **Food Database**: Store custom foods and nutrition data
2. **User Accounts**: Authentication and user profiles
3. **Sync**: Real-time data synchronization
4. **File Storage**: Store food images

**Cost**: $0/month (free tier)

**Verdict**: ⭐⭐⭐⭐⭐ **Best all-in-one solution**

---

### 5.2 PlanetScale (RECOMMENDED for MySQL)

**Overview**: Serverless MySQL platform with branching and merging.

#### Pros ✅
- **Free Tier**: 5 GB storage, 1 billion row reads/month
- **MySQL**: Vitess-powered MySQL
- **Branching**: Git-like database branches
- **No Connection Limits**: True serverless
- **Schema Changes**: Non-blocking migrations
- **Analytics**: Built-in query insights
- **Global Edge**: Low-latency worldwide

#### Cons ❌
- **MySQL Only**: No PostgreSQL
- **Learning Curve**: Branching workflow different
- **No Foreign Keys**: Vitess limitation (can work around)

#### Use Cases
1. **Food Database**: MySQL-based nutrition data
2. **User Data**: User profiles and preferences
3. **Development**: Branch database for testing

**Cost**: $0/month (free tier)

**Verdict**: ⭐⭐⭐⭐⭐ **Excellent for MySQL users**

---

### 5.3 Neon (PostgreSQL Serverless)

**Overview**: Serverless PostgreSQL with modern developer experience.

#### Pros ✅
- **Free Tier**: 3 GB storage, compute included
- **PostgreSQL**: Full PostgreSQL compatibility
- **Branching**: Database branches like Git
- **Auto-Scaling**: Scales to zero when idle
- **Connection Pooling**: Built-in pooling
- **Fast**: Separation of storage and compute

#### Cons ❌
- **Newer Service**: Less mature than competitors
- **Storage Limits**: 3 GB on free tier
- **Beta Features**: Some features still in beta

**Cost**: $0/month (free tier)

**Verdict**: ⭐⭐⭐⭐ **Great PostgreSQL alternative to Supabase**

---

### 5.4 MongoDB Atlas

**Overview**: Managed MongoDB cloud database.

#### Pros ✅
- **Free Tier**: 512 MB storage
- **MongoDB**: NoSQL document database
- **Global Clusters**: Multi-region deployment
- **Full-Text Search**: Built-in search
- **Charts**: Data visualization tools
- **Realm**: Mobile sync and serverless functions

#### Cons ❌
- **NoSQL**: Less suitable for structured nutrition data
- **Small Storage**: Only 512 MB free
- **Complexity**: Overkill for simple relational data

**Cost**: $0/month (free tier)

**Verdict**: ⭐⭐⭐ **Good for NoSQL needs, but Postgres better fit**

---

### 5.5 Cockroach DB Serverless

**Overview**: Distributed SQL database with PostgreSQL compatibility.

#### Pros ✅
- **Free Tier**: 5 GB storage, 250M RUs/month
- **PostgreSQL**: Compatible with Postgres
- **Global**: Multi-region by default
- **Auto-Scaling**: Scales to zero
- **ACID**: Full transaction support

#### Cons ❌
- **Complexity**: Distributed system (overkill for MVP)
- **Learning Curve**: Different pricing model (RUs)
- **Latency**: Some operations slower than single-region

**Cost**: $0/month (free tier)

**Verdict**: ⭐⭐⭐ **Powerful but overkill for hobby project**

---

### 5.6 Comparison: Database Hosting

| Database | Type | Free Storage | Features | Backup | Best For |
|----------|------|--------------|----------|--------|----------|
| **Supabase** | PostgreSQL | 500 MB | Auth, Storage, Realtime | Manual | All-in-one |
| **PlanetScale** | MySQL | 5 GB | Branching, Analytics | Automated | MySQL users |
| **Neon** | PostgreSQL | 3 GB | Branching, Serverless | Automated | Postgres serverless |
| **MongoDB Atlas** | NoSQL | 512 MB | Search, Charts | Automated | Document stores |
| **CockroachDB** | PostgreSQL | 5 GB | Distributed, Global | Automated | Scale-critical |

### 5.7 Recommended: Supabase

**Why Supabase wins for Keyston**:
1. **PostgreSQL**: Perfect for structured nutrition data
2. **Built-in Auth**: Future user accounts ready
3. **Auto API**: REST API generated automatically
4. **Real-time**: Sync across devices
5. **Storage**: File storage for food images
6. **TypeScript**: Excellent type support
7. **Dashboard**: Easy database management
8. **All-in-one**: Database + Auth + Storage + Functions

**Alternative**: **PlanetScale** (if preferring MySQL or needing more storage)

---

## 6. Recommended DevOps Architecture

### 6.1 Complete DevOps Stack for Keyston

```
┌─────────────────────────────────────────────────────────┐
│                   GitHub Repository                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐        │
│  │ Source Code│  │ PR Reviews │  │ Issues     │        │
│  └────────────┘  └────────────┘  └────────────┘        │
└─────────────────────────────────────────────────────────┘
                         │
                         ├─ Push to main branch
                         │
┌─────────────────────────────────────────────────────────┐
│              GitHub Actions (CI/CD)                      │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Workflow: Build & Deploy                         │   │
│  │  1. Checkout code                                │   │
│  │  2. Install dependencies                         │   │
│  │  3. Run linting (ESLint)                        │   │
│  │  4. Run tests (Jest)                            │   │
│  │  5. Build production bundle                     │   │
│  │  6. Deploy to web hosting                       │   │
│  └──────────────────────────────────────────────────┘   │
│                                                           │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Workflow: PR Preview                             │   │
│  │  - Build on every PR                             │   │
│  │  - Create preview deployment                     │   │
│  │  - Comment preview URL on PR                     │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                         │
            ┌────────────┴────────────┐
            │                         │
┌───────────▼──────────┐  ┌──────────▼──────────┐
│   Netlify/Vercel     │  │  Railway/Render     │
│  (Web Hosting)       │  │ (Backend - Future)  │
│                      │  │                     │
│  • Production Deploy │  │  • Node.js API      │
│  • PR Previews       │  │  • Auto-deploy      │
│  • Custom Domain     │  │  • Logging          │
│  • Free SSL          │  │  • Monitoring       │
└──────────────────────┘  └─────────┬───────────┘
                                    │
                          ┌─────────▼───────────┐
                          │   Supabase          │
                          │  (Database)         │
                          │                     │
                          │  • PostgreSQL       │
                          │  • Auto API         │
                          │  • Authentication   │
                          │  • File Storage     │
                          └─────────────────────┘
```

### 6.2 Workflow Architecture

#### Current Phase (MVP - No Backend)

```
Developer Push → GitHub Actions → Build → Netlify → Live Site
                      │
                      ├─ Run Tests
                      ├─ Lint Code
                      └─ Build Bundle
```

#### Future Phase (With Backend & Database)

```
Developer Push
     │
     ├─ Frontend Changes → GitHub Actions → Netlify (Web App)
     │
     └─ Backend Changes → GitHub Actions → Railway (API)
                                              │
                                              └─ Connects to → Supabase (Database)
```

### 6.3 Environment Strategy

| Environment | Trigger | Hosting | Purpose |
|-------------|---------|---------|---------|
| **Development** | Local dev server | localhost:3000 | Local testing |
| **Preview** | Every PR | Netlify Preview | PR review/testing |
| **Staging** | Push to `develop` | Netlify Staging | Integration testing |
| **Production** | Push to `main` | Netlify Production | Live public site |

---

## 7. Implementation Guide

### 7.1 Phase 1: GitHub Actions Setup (Week 1)

#### Step 1: Create GitHub Actions Workflow

Create `.github/workflows/main.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run tests
        run: npm test -- --coverage --watchAll=false
      
      - name: Build production bundle
        run: npm run build:prod
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: build/
          retention-days: 7
  
  deploy-preview:
    needs: build-and-test
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build
          path: build/
      
      - name: Deploy to Netlify (Preview)
        uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --dir=build --alias=pr-${{ github.event.number }}
  
  deploy-production:
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build
          path: build/
      
      - name: Deploy to Netlify (Production)
        uses: netlify/actions/cli@master
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        with:
          args: deploy --dir=build --prod
```

#### Step 2: Setup GitHub Secrets

Add these secrets in GitHub repository settings:

```
Settings → Secrets and variables → Actions → New repository secret
```

Required secrets:
- `NETLIFY_AUTH_TOKEN`: From Netlify account settings
- `NETLIFY_SITE_ID`: From Netlify site settings
- `REACT_APP_USDA_API_KEY`: USDA FoodData Central API key (if needed)

---

### 7.2 Phase 2: Netlify Setup (Week 1)

#### Option A: Netlify UI (Easiest)

1. **Sign up**: Go to [netlify.com](https://netlify.com) and sign up with GitHub
2. **Import project**: Click "Add new site" → "Import an existing project"
3. **Connect GitHub**: Select Keyston repository
4. **Configure build**:
   - Build command: `npm run build:prod`
   - Publish directory: `build/`
   - Node version: `18`
5. **Environment variables**:
   - Add `REACT_APP_USDA_API_KEY` if needed
6. **Deploy**: Click "Deploy site"

#### Option B: Netlify CLI (For GitHub Actions)

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login**:
   ```bash
   netlify login
   ```

3. **Initialize**:
   ```bash
   netlify init
   ```

4. **Get tokens**:
   ```bash
   netlify status  # Shows site ID
   ```

5. **Create auth token**:
   - Go to Netlify dashboard → User Settings → Applications → Personal access tokens
   - Create new token
   - Add to GitHub secrets

---

### 7.3 Phase 3: Alternative - Vercel Setup (Week 1)

If choosing Vercel instead of Netlify:

1. **Sign up**: Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. **Import project**: Click "Add New" → "Project"
3. **Connect repository**: Select Keyston
4. **Configure**:
   - Framework: Create React App (auto-detected)
   - Build command: `npm run build:prod`
   - Output directory: `build/`
5. **Deploy**: Click "Deploy"

#### Vercel GitHub Integration

Vercel automatically:
- Deploys every push to `main` (production)
- Creates preview deployments for PRs
- Comments preview URL on PRs
- Handles SSL certificates

**GitHub Action for Vercel** (optional for more control):

```yaml
- name: Deploy to Vercel
  uses: amondnet/vercel-action@v25
  with:
    vercel-token: ${{ secrets.VERCEL_TOKEN }}
    vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
    vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
    vercel-args: '--prod'
```

---

### 7.4 Phase 4: Future Backend Setup (When Needed)

#### Railway Setup

1. **Sign up**: Go to [railway.app](https://railway.app)
2. **New project**: Click "New Project"
3. **Deploy from GitHub**: Select Keyston backend repo
4. **Add PostgreSQL**: Click "New" → "Database" → "PostgreSQL"
5. **Environment variables**: Add database connection string automatically
6. **Deploy**: Railway auto-deploys on every push

#### Example Backend Structure

```
keyston-backend/
├── src/
│   ├── routes/
│   │   ├── foods.ts        # Food database API
│   │   └── users.ts        # User management
│   ├── db/
│   │   └── schema.sql      # Database schema
│   ├── middleware/
│   │   └── auth.ts         # Authentication
│   └── index.ts            # Express server
├── package.json
└── railway.json            # Railway config (optional)
```

#### Connect to Supabase (Alternative)

```typescript
// src/db/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

---

### 7.5 Phase 5: Monitoring & Observability (Optional)

#### Free Monitoring Tools

1. **Sentry** (Error Tracking)
   - Free: 5,000 errors/month
   - Setup: `npm install @sentry/react`
   ```javascript
   Sentry.init({
     dsn: "your-sentry-dsn",
     environment: process.env.NODE_ENV
   });
   ```

2. **LogRocket** (Session Replay)
   - Free: 1,000 sessions/month
   - Privacy: Skip if privacy-first

3. **Netlify Analytics**
   - Cost: $9/month (optional)
   - Server-side, privacy-friendly

4. **Plausible Analytics** (Privacy-Focused)
   - Cost: $9/month
   - GDPR compliant, no cookies

**Recommendation for Keyston**: Skip analytics initially to maintain privacy-first approach. Only add if necessary and with user consent.

---

## 8. Cost Analysis

### 8.1 Current Phase (MVP - Web Only)

| Service | Usage | Monthly Cost |
|---------|-------|--------------|
| **GitHub Actions** | Public repo | $0 |
| **Netlify** | 100 GB bandwidth | $0 |
| **Domain (optional)** | Custom domain | $1-2/month |
| **Total** | | **$0-2/month** |

### 8.2 Future Phase (Backend + Database)

| Service | Usage | Monthly Cost |
|---------|-------|--------------|
| **GitHub Actions** | Public repo | $0 |
| **Netlify** | 100 GB bandwidth | $0 |
| **Railway** | $5 credit | $0 (within credit) |
| **Supabase** | 500 MB database | $0 |
| **Domain** | Custom domain | $1-2/month |
| **Total** | | **$0-2/month** |

### 8.3 Growth Phase (1,000+ Users)

Assuming 1,000 active users:

| Service | Usage | Monthly Cost | Notes |
|---------|-------|--------------|-------|
| **GitHub Actions** | Public repo | $0 | Still free |
| **Netlify** | ~200 GB bandwidth | $0 | Still within free tier |
| **Railway** | Exceeds $5 credit | $10-20 | Pay-as-you-go |
| **Supabase** | 1-2 GB database | $25 | Pro plan |
| **Domain** | Custom domain | $1-2 | Same |
| **CDN** | Cloudflare | $0 | Optional, free tier |
| **Total** | | **$36-47/month** |

### 8.4 Cost Optimization Tips

1. **Minimize API Calls**: Cache nutrition data aggressively in IndexedDB
2. **Lazy Load**: Use code splitting to reduce initial bundle size
3. **Image Optimization**: Use WebP format, compress images
4. **CDN**: Use Cloudflare in front of Netlify (optional)
5. **Database Indexes**: Optimize queries to reduce compute costs
6. **Serverless Functions**: Only use when necessary (cold starts acceptable)

---

## 9. Comparison Tables

### 9.1 Overall Recommendations Summary

| Component | Recommended | Alternative | Cost |
|-----------|-------------|-------------|------|
| **CI/CD** | GitHub Actions | CircleCI | $0 |
| **Web Hosting** | Netlify | Vercel, GitHub Pages | $0 |
| **Backend** | Railway | Render, Fly.io | $0 |
| **Database** | Supabase | PlanetScale, Neon | $0 |
| **Monitoring** | (Optional) Sentry | LogRocket | $0 |
| **CDN** | (Optional) Cloudflare | Included in Netlify | $0 |

### 9.2 Decision Matrix

Rate each option based on Keyston's requirements:

| Criteria | Weight | GitHub Actions | CircleCI | Travis CI | GitLab CI |
|----------|--------|----------------|----------|-----------|-----------|
| **Free Tier** | 30% | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐ | ⭐⭐⭐ |
| **Integration** | 25% | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Ease of Use** | 20% | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Features** | 15% | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Community** | 10% | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Total Score** | | **4.85/5** | **3.6/5** | **2.4/5** | **2.8/5** |

**Winner**: **GitHub Actions** (4.85/5)

---

## 10. Implementation Timeline

### Week 1: Setup CI/CD & Web Hosting

- [ ] Day 1-2: Create GitHub Actions workflows
  - CI workflow (lint, test, build)
  - Deploy workflow (Netlify)
  - PR preview workflow
- [ ] Day 3: Setup Netlify account and integration
  - Connect GitHub repository
  - Configure build settings
  - Add environment variables
- [ ] Day 4: Test deployments
  - Test PR preview deployments
  - Test production deployment
  - Verify live site functionality
- [ ] Day 5: Documentation
  - Document deployment process
  - Create runbook for troubleshooting
  - Update README with deployment info

### Week 2-4: Backend Setup (When Ready)

- [ ] Week 2: Setup Railway and Supabase
  - Create Railway account
  - Create Supabase account
  - Connect GitHub repository to Railway
  - Configure database connection
- [ ] Week 3: Build API backend
  - Create Express.js API
  - Define database schema
  - Implement food database endpoints
  - Add authentication
- [ ] Week 4: Integration and testing
  - Connect frontend to backend
  - Test end-to-end flows
  - Deploy to production

---

## 11. Success Metrics

### Key Performance Indicators (KPIs)

1. **Deployment Frequency**
   - Target: Daily deployments
   - Current: Manual deployments

2. **Build Time**
   - Target: < 5 minutes
   - Monitor via GitHub Actions

3. **Deploy Time**
   - Target: < 2 minutes
   - Monitor via Netlify dashboard

4. **Uptime**
   - Target: 99.9%
   - Monitor via Netlify/Railway status

5. **Preview Deployment Success**
   - Target: 100% of PRs get preview
   - Monitor PR comments

---

## 12. Risk Assessment & Mitigation

### Potential Risks

1. **Free Tier Limitations**
   - **Risk**: Exceeding free tier limits
   - **Mitigation**: Monitor usage, optimize bundle size, implement caching
   - **Backup Plan**: Upgrade to paid tier ($10-20/month acceptable)

2. **Service Downtime**
   - **Risk**: Netlify/Railway service outages
   - **Mitigation**: Have alternative hosting ready (Vercel/Render)
   - **Backup Plan**: Documented migration process

3. **Breaking Changes**
   - **Risk**: CI/CD breaking from dependencies
   - **Mitigation**: Pin action versions, test thoroughly
   - **Backup Plan**: Version rollback process

4. **Privacy Compliance**
   - **Risk**: Accidentally enabling tracking
   - **Mitigation**: Regular privacy audits, disable analytics
   - **Backup Plan**: Clear privacy policy

---

## 13. Conclusion

### Final Recommendations

**Immediate Implementation (Week 1)**:
1. ✅ **GitHub Actions** - Free CI/CD automation
2. ✅ **Netlify** - Free web hosting with PR previews
3. ✅ **Custom Domain** (optional) - $12/year for professional URL

**Future Implementation (When Backend Needed)**:
4. ✅ **Railway** - Free backend hosting ($5 credit/month)
5. ✅ **Supabase** - Free PostgreSQL database (500 MB)

**Total Cost**: **$0-2/month** for MVP, scaling to ~$40/month at 1,000 users

### Why This Stack?

1. **Zero Initial Cost**: Perfect for hobby project
2. **GitHub Integration**: Everything in one ecosystem
3. **Easy Deployment**: Push to deploy, no complex configs
4. **Scalable**: Can grow with the project
5. **Privacy-First**: Self-hosted options available
6. **Modern Tools**: Industry-standard DevOps practices
7. **One-Person Friendly**: Minimal maintenance required

### Next Steps

1. **Week 1**: Implement GitHub Actions workflows
2. **Week 1**: Setup Netlify deployment
3. **Week 2**: Test PR preview deployments
4. **Week 3**: Document deployment process
5. **Future**: Add backend when feature development requires it

---

## 14. Additional Resources

### Documentation Links

- **GitHub Actions**: https://docs.github.com/actions
- **Netlify**: https://docs.netlify.com
- **Vercel**: https://vercel.com/docs
- **Railway**: https://docs.railway.app
- **Supabase**: https://supabase.com/docs
- **PlanetScale**: https://docs.planetscale.com

### Tutorials

- [GitHub Actions for React Apps](https://docs.github.com/en/actions/guides/building-and-testing-nodejs)
- [Deploy Ionic React to Netlify](https://www.netlify.com/blog/2020/03/03/how-to-deploy-a-react-application-to-netlify/)
- [Building APIs with Railway](https://docs.railway.app/tutorials/deploy-a-nodejs-app)
- [Supabase Quick Start](https://supabase.com/docs/guides/getting-started/quickstarts/reactjs)

### Community Resources

- GitHub Actions Marketplace: https://github.com/marketplace?type=actions
- Awesome GitHub Actions: https://github.com/sdras/awesome-actions
- Netlify Community: https://answers.netlify.com
- Railway Community: https://discord.gg/railway

---

**Document Version**: 1.0  
**Last Updated**: November 15, 2024  
**Author**: Keyston DevOps Research  
**Status**: Ready for Implementation
