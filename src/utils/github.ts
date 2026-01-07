/**
 * GitHub API utilities for fetching contribution data.
 *
 * Uses the GitHub GraphQL API to fetch contribution calendar data
 * for use in visualizations like the brick breaker game.
 */

export interface ContributionDay {
  date: string;
  contributionCount: number;
  contributionLevel: "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE";
  color: string;
  weekday: number;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

export interface GitHubContributionData {
  username: string;
  calendar: ContributionCalendar;
}

/**
 * Contribution level to hit points mapping for brick breaker game.
 * NONE = hidden (no brick), higher levels = more hits to break.
 */
export const CONTRIBUTION_LEVEL_HITS: Record<ContributionDay["contributionLevel"], number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

/**
 * Fetches contribution calendar data for a GitHub user.
 *
 * Requires GITHUB_TOKEN environment variable with read:user scope.
 * Falls back to mock data if token is not available (for development).
 */
export async function fetchGitHubContributions(username: string): Promise<GitHubContributionData | null> {
  const token = import.meta.env.GITHUB_TOKEN;

  if (!token) {
    console.warn(`[GitHub] No GITHUB_TOKEN found. Using mock data for ${username}.`);

    return generateMockContributions(username);
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                contributionLevel
                color
                weekday
              }
            }
          }
        }
      }
    }
  `;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (!response.ok) {
      console.error(`[GitHub] API error for ${username}: ${response.status}`);
      return generateMockContributions(username);
    }

    const data = await response.json();

    if (data.errors) {
      console.error(`[GitHub] GraphQL errors for ${username}:`, data.errors);

      return generateMockContributions(username);
    }

    const calendar = data.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      console.error(`[GitHub] No contribution data found for ${username}`);

      return generateMockContributions(username);
    }

    return {
      username,
      calendar,
    };
  } catch (error) {
    console.error(`[GitHub] Failed to fetch contributions for ${username}:`, error);

    return generateMockContributions(username);
  }
}

/**
 * Fetches contributions for multiple GitHub users in parallel.
 */
export async function fetchMultipleContributions(usernames: string[]): Promise<GitHubContributionData[]> {
  const results = await Promise.all(usernames.map(fetchGitHubContributions));
  return results.filter((r): r is GitHubContributionData => r !== null);
}

/**
 * Generates mock contribution data for development/fallback.
 * Creates a realistic-looking contribution pattern.
 */
function generateMockContributions(username: string): GitHubContributionData {
  const levels: ContributionDay["contributionLevel"][] = ["NONE", "FIRST_QUARTILE", "SECOND_QUARTILE", "THIRD_QUARTILE", "FOURTH_QUARTILE"];

  const colors: Record<ContributionDay["contributionLevel"], string> = {
    NONE: "#ebedf0",
    FIRST_QUARTILE: "#9be9a8",
    SECOND_QUARTILE: "#40c463",
    THIRD_QUARTILE: "#30a14e",
    FOURTH_QUARTILE: "#216e39",
  };

  // Generate 52 weeks of mock data
  const weeks: ContributionWeek[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 364); // Go back ~1 year

  let totalContributions = 0;

  for (let week = 0; week < 52; week++) {
    const contributionDays: ContributionDay[] = [];

    for (let day = 0; day < 7; day++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + week * 7 + day);

      // Create a semi-random but realistic pattern
      // More active on weekdays, occasional bursts
      const isWeekend = day === 0 || day === 6;
      const baseChance = isWeekend ? 0.3 : 0.6;
      const burstMultiplier = Math.sin(week * 0.5) > 0.5 ? 1.5 : 1;

      let level: ContributionDay["contributionLevel"];
      const rand = Math.random() * burstMultiplier;

      if (rand < baseChance * 0.3) {
        level = "NONE";
      } else if (rand < baseChance * 0.5) {
        level = "FIRST_QUARTILE";
      } else if (rand < baseChance * 0.7) {
        level = "SECOND_QUARTILE";
      } else if (rand < baseChance * 0.9) {
        level = "THIRD_QUARTILE";
      } else {
        level = "FOURTH_QUARTILE";
      }

      const contributionCount = level === "NONE" ? 0 : Math.floor(Math.random() * 10 * levels.indexOf(level)) + 1;

      totalContributions += contributionCount;

      contributionDays.push({
        date: date.toISOString().split("T")[0],
        contributionCount,
        contributionLevel: level,
        color: colors[level],
        weekday: day,
      });
    }

    weeks.push({ contributionDays });
  }

  return {
    username,
    calendar: {
      totalContributions,
      weeks,
    },
  };
}

/**
 * Flattens contribution weeks into a 2D grid suitable for game rendering.
 * Returns [week][day] indexed array with contribution levels.
 */
export function flattenContributionsToGrid(data: GitHubContributionData[]): ContributionDay[][] {
  const allDays: ContributionDay[][] = [];

  for (const user of data) {
    for (const week of user.calendar.weeks) {
      allDays.push(week.contributionDays);
    }
  }

  return allDays;
}
