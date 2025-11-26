// Copyright 2025 Ian Lewis
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { GitHubResourceType, type GitHubIssueOrPR } from "./types.js";

// GitHub Octocat logo image as base64 data URL
const GITHUB_LOGO =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAA7AAAAOwBeShxvQAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVFiF7ZdPaBxVHMe/v5nZbJO0TZPapKYxpY0Yq0JEaRUUxFLwIIJ4EARvHkQP0osHQfDgRRAPnoSKB8VDQQ8KHqSFihURRfBQRVpQqI0xadJNszWb3d3Z2dl5j8NmN5vNH9vUpIL5wuPNb97v/T7fN2/ezAMeVuJBCkTkJID3APQA6BKRNgBNAGoB3AVwB8AWgKsicgXA5yJydV+Agf4rL3z7+omdqo5rKztXdN9+dOJU6tDJ0+bQ8VMmfviktf+ZseLE2Fi1euzZYd04c6Y+OjGxUJmY+KYyOfltdXJyuTo1dWOflWIA5wCcE5HovgA+X/2yuv1oV9Qb+PXs5Kl2M37mjWji+YnRysSxF6uTZybqEy+8lI+d/deRfRYuicg7IrJ8XwCfrz4rIl/uVNP2V5enj8VPPnc0evSpV6KJyVeq55+fSPd78HEROSsif+0L4PPVL0XkRVvVw1+dfyc6cuK16OSp16vnn39p38ADQQA0ApgCUNqppp0vPjk7Gi09+nz0+DO/7vfYBxQAGADgA9AFoNNRtwDoAlB0lL9Q8Tfu3g4vfPiTQ+kHaD+fYgv/A4wCqDrKH2x4Tdbvu4HvA0sAtAMod9Q/MNQBeB/AbQCLAH4EsATgBoDzANJ/1xxlG8CnInIRQHhfuQDg85O/ALge5kzv+FNvmo5cxw/FfF6jRr/Bs29evHr+3LsNQHm/gHM+X/0CwKyI/NvgPPxV1iJz5t1/lxa/8EF8evuJR9sDQ/kHlzSPqWqPqu7cSyZiS4sl9Pd/uB4EQ+P3mxWAaICPAYQAsoH+yyurv3zU3Oz0H6y1nq2saZX5/S+LyA9ARkQyAO4CeBfAUwBONebCfj31TWdbi/3lv1spnP/hYrZleGt/U3ABJP/XKgDgm0vnvr52efrNtsO9b/vb10wul0tYa2k2m1Y/fPgvVf3QDDQ/C+Ddzb8uv7JVWj8zevKli5euvPH04SevJWa3Gvb7d1e+u3OPHXi/+tdzm/w9PnQ+DeBXEfnWoW1pCg4BqLTIr4pIa4v8QKYgByAJIBGVU9a+d+2kxSwAF/qHy+R+TQG473T0sNK/Jt70ZXpQXWkAAAAASUVORK5CYII=";

/**
 * Create a preview card for a GitHub issue or PR
 */
export function createPreviewCard(
  data: GitHubIssueOrPR,
): GoogleAppsScript.Card_Service.Card {
  const type = data.type === GitHubResourceType.PullRequest ? "PR" : "Issue";
  const title = `${data.owner}/${data.repo} #${data.number}`;
  const subtitle = `${type}: ${data.title}`;

  return CardService.newCardBuilder()
    .setHeader(
      CardService.newCardHeader()
        .setTitle(title)
        .setSubtitle(subtitle)
        .setImageUrl(GITHUB_LOGO),
    )
    .build();
}

/**
 * Create a smart chip widget for a GitHub URL
 */
export function createSmartChip(
  url: string,
  data: GitHubIssueOrPR,
): Record<string, unknown> {
  const type = data.type === GitHubResourceType.PullRequest ? "PR" : "Issue";
  const chipText = `${data.owner}/${data.repo} ${type} #${data.number}`;

  return {
    text: chipText,
    iconUrl: GITHUB_LOGO,
    title: data.title,
  };
}
