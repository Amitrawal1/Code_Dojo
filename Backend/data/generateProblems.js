// Script to fetch ~1000 LeetCode problems with proper topic tags
import fs from 'fs';

const trackMap = {
  'array': 'Array', 'string': 'String', 'hash-table': 'Hashing',
  'dynamic-programming': 'DP', 'math': 'Math', 'sorting': 'Sorting',
  'greedy': 'Greedy', 'depth-first-search': 'DFS', 'binary-search': 'Binary Search',
  'breadth-first-search': 'BFS', 'tree': 'Tree', 'matrix': 'Matrix',
  'two-pointers': 'Two Pointer', 'bit-manipulation': 'Bit Manipulation',
  'stack': 'Stack', 'heap-priority-queue': 'Heap', 'graph': 'Graph',
  'linked-list': 'Linked List', 'backtracking': 'Backtracking',
  'sliding-window': 'Sliding Window', 'divide-and-conquer': 'Divide & Conquer',
  'union-find': 'Union Find', 'trie': 'Trie', 'design': 'Design',
  'monotonic-stack': 'Stack', 'binary-tree': 'Tree', 'prefix-sum': 'Array',
  'queue': 'Stack', 'recursion': 'Tree', 'merge-sort': 'Merge Sort',
  'counting': 'Hashing', 'simulation': 'Array', 'enumeration': 'Array',
  'number-theory': 'Math', 'geometry': 'Math', 'combinatorics': 'Math',
  'topological-sort': 'Graph', 'segment-tree': 'Tree',
  'binary-indexed-tree': 'Tree', 'memoization': 'DP',
  'bitmask': 'Bit Manipulation', 'ordered-set': 'Sorting',
  'shortest-path': 'Graph', 'game-theory': 'DP',
};

function getTrack(topicTags) {
  if (!topicTags || !topicTags.length) return 'Array';
  for (const t of topicTags) {
    const mapped = trackMap[t.slug];
    if (mapped) return mapped;
  }
  return 'Array';
}

function makeFnName(title) {
  const words = title.replace(/[^a-zA-Z0-9 ]/g, '').split(' ').filter(Boolean);
  if (!words.length) return 'solve';
  return words[0].toLowerCase() + words.slice(1).map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');
}

async function fetchProblemsWithTags() {
  const query = `query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {
      total: totalNum
      questions: data {
        frontendQuestionId: questionFrontendId
        title
        titleSlug
        difficulty
        paidOnly: isPaidOnly
        topicTags { name slug }
      }
    }
  }`;

  const results = [];
  for (let skip = 0; skip < 2500; skip += 100) {
    console.log(`Fetching batch ${skip}...`);
    try {
      const res = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          variables: { categorySlug: 'all-code-essentials', limit: 100, skip, filters: {} }
        })
      });
      const data = await res.json();
      const questions = data?.data?.problemsetQuestionList?.questions || [];
      if (!questions.length) break;
      results.push(...questions);
    } catch (e) {
      console.log(`Batch ${skip} failed, skipping...`);
    }
  }
  return results;
}

async function main() {
  console.log('Fetching problems with tags from LeetCode GraphQL...');
  const allQuestions = await fetchProblemsWithTags();
  
  const freeProblems = allQuestions
    .filter(q => !q.paidOnly)
    .sort((a, b) => parseInt(a.frontendQuestionId) - parseInt(b.frontendQuestionId))
    .slice(0, 1000);

  console.log(`Got ${freeProblems.length} free problems with tags.`);

  const problems = freeProblems.map(q => {
    const fn = makeFnName(q.title);
    const diff = q.difficulty.toLowerCase();
    const track = getTrack(q.topicTags);

    return {
      title: q.title,
      slug: q.titleSlug,
      description: `Solve: ${q.title}`,
      difficulty: diff,
      track,
      starterCode: {
        python: `def ${fn}():\n    pass`,
        javascript: `function ${fn}() {\n  \n}`,
        java: 'class Solution { }',
        cpp: 'int main() { }'
      },
      testCases: [{ input: 'see problem', output: 'see problem' }]
    };
  });

  const fileContent = `export const problems = ${JSON.stringify(problems, null, 2)};\n`;
  fs.writeFileSync(new URL('./dsaProblems.js', import.meta.url), fileContent);
  console.log(`✅ Generated ${problems.length} problems in dsaProblems.js`);
  
  // Print track distribution
  const trackCount = {};
  problems.forEach(p => { trackCount[p.track] = (trackCount[p.track] || 0) + 1; });
  console.log('\nTrack distribution:');
  Object.entries(trackCount).sort((a,b) => b[1]-a[1]).forEach(([t,c]) => console.log(`  ${t}: ${c}`));
}

main().catch(console.error);
