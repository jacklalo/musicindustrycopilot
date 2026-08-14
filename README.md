# MIC

HASHTAG NP — ARTIST INTELLIGENCE DASHBOARD

PRODUCT + TECH BRIEF

PROJECT OVERVIEW

Create a premium artist intelligence dashboard for Hashtag NP (#NP), the artist management company founded by Pascal Nègre.

The platform centralizes artist performance data across streaming, social media, live events and audience growth into a single cinematic dashboard experience.

The goal is NOT to build a generic startup analytics SaaS.

The goal is to create a:

luxury music intelligence platform

management cockpit

cultural performance terminal

The interface must feel premium, minimal, futuristic and music-industry oriented.

PRODUCT GOALS

The platform should help management teams:

track artist growth

monitor streaming performance

compare artists

identify momentum shifts

detect viral trends

understand audience evolution

analyze content performance

monitor tour performance

generate strategic insights

IMPORTANT TECH CONSTRAINT

The frontend MUST be designed to work with:

Webflow as the visual frontend layer

external backend services for logic and data

This is NOT a full React frontend application.

The architecture should be:

Webflow = UI / frontend

Supabase = database

Make or n8n = automations

APIs = external data sources

custom JavaScript embeds = dynamic charts and components

The system must therefore be compatible with:

Webflow embeds

custom JS scripts

external APIs

Supabase REST queries

iframe or script-based chart rendering

Avoid proposing:

fully custom frontend architectures

complex React-only approaches

heavy enterprise dashboards

The product should remain:

lightweight

elegant

visually premium

realistic to integrate into Webflow

CORE FEATURES

1. Artist Leaderboard

Main dashboard displaying all managed artists.

Metrics

Spotify monthly listeners

Stream evolution

Instagram followers

TikTok followers

YouTube subscribers

Engagement rate

Playlist additions

Tour ticket sales

Merch performance

Viral growth indicators

Features

ranking system

momentum score

trend indicators

weekly evolution

monthly evolution

sortable metrics

filters

search

2. Artist Detail Page

Detailed page for each artist.

Sections

Global Overview

artist summary

momentum score

growth indicators

Streaming Analytics

Spotify growth

stream history

playlist impact

top tracks

Social Analytics

Instagram performance

TikTok performance

YouTube evolution

engagement tracking

Geographic Insights

top countries

top cities

audience heatmaps

Live Performance

ticket sales evolution

venue performance

tour metrics

Content Intelligence

best performing content

viral posts

engagement analysis

3. AI Insights System

Daily AI-generated insights.

Examples:

“Artist X is currently accelerating in Germany.”

“TikTok engagement increased 42% this week.”

“Recent live-performance content generated the highest stream conversion.”

These insights can be generated using:

OpenAI API

Claude API

4. Alerts System

Examples:

sudden follower spike

unusual stream drop

viral content detection

strong geographic growth

high-performing release

DATA SOURCES

Potential APIs:

Spotify API

YouTube API

Instagram Graph API

TikTok APIs

Chartmetric

Songstats

Ticketmaster

Bandsintown

DATABASE

Use Supabase for:

artist data

historical metrics

API synchronization

user authentication

permissions

cached analytics

AUTOMATIONS

Use Make or n8n for:

scheduled API fetching

data synchronization

metric updates

AI summary generation

alerts

FRONTEND IMPLEMENTATION

IMPORTANT

The frontend is primarily built in Webflow.

Claude should therefore:

generate Webflow-compatible structures

generate clean embeddable JavaScript

generate lightweight dynamic components

avoid overengineering

Preferred approach:

Webflow layouts

custom embed sections

JS chart rendering

Supabase API fetching

external script injections where needed

Avoid:

requiring a full React frontend rewrite

requiring Next.js rendering

requiring complex deployment infrastructures

CHARTS

Use:

Chart.js

ECharts

ApexCharts
or

lightweight visualization libraries

Charts must feel:

cinematic

elegant

minimal

luxury-oriented

Avoid:

rainbow dashboards

enterprise analytics aesthetics

startup SaaS feeling

DESIGN DIRECTION

VISUAL MOOD

Luxury music intelligence.

Mix between:

Apple Music

Spotify Wrapped premium

Formula 1 telemetry

fashion industry dashboards

cinematic UI systems

high-end editorial design

COLORS

Base

deep black

graphite grey

soft white

Accent colors

electric purple

signal red

warm gold

deep blue

Use accent colors subtly.

TYPOGRAPHY

Recommended:

Neue Montreal

Söhne

Suisse Intl

Geist

Typography should feel:

premium

fashion-oriented

music-industry focused

minimal

UI PRINCIPLES

large typography

strong spacing

minimal borders

elegant charts

smooth transitions

subtle glass effects

cinematic imagery

editorial composition

The interface should feel like:
a luxury music operating system.

LONG TERM VISION

Potential evolution:

internal management tool

SaaS for labels

live performance intelligence platform

artist growth monitoring system

cultural analytics platform

The architecture should therefore remain scalable while still allowing a fast premium MVP inside Webflow.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://musicindustrycopilot.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/43e7b37f-46f7-4d2a-8450-ff9f540e3c85).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
