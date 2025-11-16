export interface Task {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  tags: string[];
  description: string;
  examples: Array<{ input: string; output: string; explanation?: string }>;
  constraints: string[];
  starterCode: string;
  solution?: string;
  completed?: boolean;
  courseId?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  total: number;
  tags: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isFree: boolean;
}

export interface Lecture {
  id: string;
  title: string;
  topic: string;
  readTime: string;
  completed: boolean;
  content: string;
  courseId?: string;
}

export const tasks: Task[] = [
  {
    id: '021231',
    title: 'Find the First Missing Positive',
    difficulty: 'Easy',
    category: 'Arrays',
    tags: ['Arrays', 'Hash Table'],
    description: `Given an unsorted integer array nums, return the smallest missing positive integer.

You must implement an algorithm that runs in O(n) time and uses O(1) auxiliary space.`,
    examples: [
      { input: 'nums = [1,2,0]', output: '3', explanation: 'The numbers in the range [1,2] are all in the array.' },
      { input: 'nums = [3,4,-1,1]', output: '2' },
      { input: 'nums = [7,8,9,11,12]', output: '1' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-2^31 <= nums[i] <= 2^31 - 1'],
    starterCode: `function firstMissingPositive(nums: number[]): number {
    // Write your solution here
    
}`,
    completed: false,
    courseId: 'course-1',
  },
  {
    id: '021232',
    title: 'Design a Min Stack',
    difficulty: 'Medium',
    category: 'Stack',
    tags: ['Stack', 'Design'],
    description: `Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.

Implement the MinStack class:
- MinStack() initializes the stack object.
- void push(int val) pushes the element val onto the stack.
- void pop() removes the element on the top of the stack.
- int top() gets the top element of the stack.
- int getMin() retrieves the minimum element in the stack.

You must implement a solution with O(1) time complexity for each function.`,
    examples: [
      {
        input: `["MinStack","push","push","push","getMin","pop","top","getMin"]
[[],[-2],[0],[-3],[],[],[],[]]`,
        output: `[null,null,null,null,-3,null,0,-2]`,
      },
    ],
    constraints: ['-2^31 <= val <= 2^31 - 1', 'Methods pop, top and getMin operations will always be called on non-empty stacks.'],
    starterCode: `class MinStack {
    constructor() {
        
    }

    push(val: number): void {
        
    }

    pop(): void {
        
    }

    top(): number {
        
    }

    getMin(): number {
        
    }
}`,
    completed: true,
    courseId: 'course-1',
  },
  {
    id: '021233',
    title: 'Count Inversions in an Array',
    difficulty: 'Hard',
    category: 'Sorting',
    tags: ['Divide and Conquer', 'Merge Sort'],
    description: `Given an array of integers, count the number of inversions it has. An inversion is when a pair of elements (arr[i], arr[j]) exists such that i < j and arr[i] > arr[j].`,
    examples: [
      { input: 'arr = [2, 4, 1, 3, 5]', output: '3', explanation: 'The pairs (2,1), (4,1), and (4,3) are inversions.' },
      { input: 'arr = [1, 2, 3, 4, 5]', output: '0' },
    ],
    constraints: ['1 <= arr.length <= 10^5', '1 <= arr[i] <= 10^9'],
    starterCode: `function countInversions(arr: number[]): number {
    // Write your solution here
    
}`,
    completed: false,
    courseId: 'course-2',
  },
  {
    id: '021234',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    category: 'Strings',
    tags: ['String', 'Dynamic Programming'],
    description: `Given a string s, return the longest palindromic substring in s.`,
    examples: [
      { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also a valid answer.' },
      { input: 's = "cbbd"', output: '"bb"' },
    ],
    constraints: ['1 <= s.length <= 1000', 's consist of only digits and English letters.'],
    starterCode: `function longestPalindrome(s: string): string {
    // Write your solution here
    
}`,
    completed: false,
    courseId: 'course-1',
  },
  {
    id: '021235',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Easy',
    category: 'Trees',
    tags: ['Tree', 'BFS'],
    description: `Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).`,
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 2000].', '-1000 <= Node.val <= 1000'],
    starterCode: `function levelOrder(root: TreeNode | null): number[][] {
    // Write your solution here
    
}`,
    completed: true,
    courseId: 'course-1',
  },
  {
    id: '021236',
    title: 'Implement Queue using Stacks',
    difficulty: 'Easy',
    category: 'Queue',
    tags: ['Stack', 'Queue', 'Design'],
    description: `Implement a first in first out (FIFO) queue using only two stacks.`,
    examples: [
      { input: '["MyQueue", "push", "push", "peek", "pop", "empty"]', output: '[null, null, null, 1, 1, false]' },
    ],
    constraints: ['1 <= x <= 9', 'At most 100 calls will be made to push, pop, peek, and empty.'],
    starterCode: `class MyQueue {
    constructor() {
        
    }

    push(x: number): void {
        
    }

    pop(): number {
        
    }

    peek(): number {
        
    }

    empty(): boolean {
        
    }
}`,
    completed: false,
    courseId: 'course-1',
  },
  {
    id: '021237',
    title: 'Graph Valid Tree',
    difficulty: 'Medium',
    category: 'Graphs',
    tags: ['Graph', 'DFS', 'Union Find'],
    description: `Given n nodes labeled from 0 to n-1 and a list of undirected edges, check if these edges form a valid tree.`,
    examples: [
      { input: 'n = 5, edges = [[0,1], [0,2], [0,3], [1,4]]', output: 'true' },
      { input: 'n = 5, edges = [[0,1], [1,2], [2,3], [1,3], [1,4]]', output: 'false' },
    ],
    constraints: ['1 <= n <= 2000', '0 <= edges.length <= 5000'],
    starterCode: `function validTree(n: number, edges: number[][]): boolean {
    // Write your solution here
    
}`,
    completed: false,
    courseId: 'course-2',
  },
  {
    id: '021238',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    category: 'Linked Lists',
    tags: ['Linked List', 'Recursion'],
    description: `Merge two sorted linked lists and return it as a sorted list.`,
    examples: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' },
    ],
    constraints: ['The number of nodes in both lists is in the range [0, 50].', '-100 <= Node.val <= 100'],
    starterCode: `function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
    // Write your solution here
    
}`,
    completed: true,
    courseId: 'course-3',
  },
];

export const courses: Course[] = [
  {
    id: 'course-1',
    title: 'Algorithms Fundamentals',
    description: 'Learn the core principles of algorithms and data structures — including arrays, linked lists, stacks, queues, and trees.',
    progress: 13,
    total: 35,
    tags: ['Beginner', 'Free'],
    difficulty: 'Beginner',
    isFree: true,
  },
  {
    id: 'course-2',
    title: 'Advanced Algorithms',
    description: 'Deep dive into complex algorithms including graph theory, dynamic programming, and advanced tree structures.',
    progress: 0,
    total: 42,
    tags: ['Advanced', 'Premium'],
    difficulty: 'Advanced',
    isFree: false,
  },
  {
    id: 'course-3',
    title: 'Data Structures Mastery',
    description: 'Master all essential data structures with hands-on implementation and real-world applications.',
    progress: 8,
    total: 28,
    tags: ['Intermediate', 'Free'],
    difficulty: 'Intermediate',
    isFree: true,
  },
];

export const lectures: Lecture[] = [
  {
    id: 'lec-1',
    title: 'Introduction to Arrays',
    topic: 'Arrays',
    readTime: '8 min read',
    completed: true,
    courseId: 'course-1',
    content: `# Introduction to Arrays

Arrays are one of the most fundamental data structures in computer science. An array is a collection of elements stored at contiguous memory locations, where each element can be accessed using an index.

## Key Characteristics

- **Fixed Size**: Arrays have a predetermined size that cannot be changed once created
- **Random Access**: Any element can be accessed in O(1) time using its index
- **Homogeneous**: All elements must be of the same data type
- **Zero-Indexed**: In most languages, array indices start at 0

## Time Complexity

- Access: O(1)
- Search: O(n)
- Insertion: O(n)
- Deletion: O(n)

## Common Operations

### Traversal
Visiting each element in the array sequentially.

### Insertion
Adding a new element requires shifting all subsequent elements.

### Deletion
Removing an element requires shifting all subsequent elements to fill the gap.

## Use Cases

Arrays are perfect when:
- You need fast access to elements by index
- The size of the collection is known in advance
- You need to iterate through elements sequentially`,
  },
  {
    id: 'lec-2',
    title: 'Two Pointer Technique',
    topic: 'Arrays',
    readTime: '12 min read',
    completed: true,
    courseId: 'course-1',
    content: `# Two Pointer Technique

The two pointer technique is a powerful algorithmic pattern used to solve array and string problems efficiently. It involves using two pointers that traverse the data structure, often from different directions or at different speeds.

## Types of Two Pointer Approaches

### 1. Opposite Direction
Pointers start at opposite ends and move towards each other.

**Example**: Finding a pair that sums to a target in a sorted array.

### 2. Same Direction
Both pointers start from the same position and move at different speeds.

**Example**: Removing duplicates from a sorted array.

## Time Complexity

The two pointer technique typically reduces time complexity from O(n²) to O(n) by eliminating the need for nested loops.

## Common Problems

- Palindrome checking
- Two sum in sorted array
- Container with most water
- Removing duplicates
- Trapping rainwater

## When to Use

Consider two pointers when:
- Working with sorted arrays
- Need to find pairs or subarrays
- Space complexity must be O(1)
- Problem involves comparing elements`,
  },
  {
    id: 'lec-3',
    title: 'Sliding Window Pattern',
    topic: 'Arrays',
    readTime: '15 min read',
    completed: false,
    courseId: 'course-1',
    content: `# Sliding Window Pattern

The sliding window technique is used to perform operations on a specific window size of an array or linked list. Instead of recalculating from scratch, we "slide" the window and update results incrementally.

## Types of Windows

### Fixed Size Window
The window size remains constant throughout.

### Variable Size Window
The window size changes based on certain conditions.

## How It Works

1. Create a window of the desired size
2. Perform initial calculation for the first window
3. Slide the window by one position
4. Update the result by removing the leftmost element and adding the new rightmost element
5. Repeat until the window reaches the end

## Time Complexity

Reduces time complexity from O(n*k) to O(n) where k is the window size.

## Common Applications

- Maximum sum subarray of size k
- Longest substring with k distinct characters
- Minimum window substring
- Find all anagrams in a string

## Implementation Tips

- Use a hash map for character/element frequency
- Keep track of window start and end pointers
- Update window state incrementally`,
  },
  {
    id: 'lec-4',
    title: 'Stack Fundamentals',
    topic: 'Stacks',
    readTime: '10 min read',
    completed: true,
    courseId: 'course-1',
    content: `# Stack Fundamentals

A stack is a linear data structure that follows the Last In First Out (LIFO) principle. Think of it like a stack of plates - you can only add or remove plates from the top.

## Core Operations

### Push
Add an element to the top of the stack - O(1)

### Pop
Remove and return the top element - O(1)

### Peek/Top
View the top element without removing it - O(1)

### isEmpty
Check if the stack is empty - O(1)

## Implementation

Stacks can be implemented using:
- Arrays
- Linked Lists

## Common Applications

- Function call stack in programming languages
- Undo/Redo functionality
- Expression evaluation
- Backtracking algorithms
- Browser history

## When to Use Stacks

Consider using a stack when:
- You need to reverse something
- Checking for balanced parentheses
- Implementing recursion iteratively
- Tracking previous states`,
  },
  {
    id: 'lec-5',
    title: 'Queue Implementation',
    topic: 'Queues',
    readTime: '12 min read',
    completed: false,
    courseId: 'course-1',
    content: `# Queue Implementation

A queue is a linear data structure that follows the First In First Out (FIFO) principle. Like a line at a store - first person in line is the first to be served.

## Core Operations

### Enqueue
Add an element to the rear - O(1)

### Dequeue
Remove element from the front - O(1)

### Front/Peek
View the front element - O(1)

### isEmpty
Check if queue is empty - O(1)

## Types of Queues

### Simple Queue
Basic FIFO queue

### Circular Queue
Last position connects back to first position

### Priority Queue
Elements are dequeued based on priority

### Deque (Double-ended Queue)
Insertion and deletion from both ends

## Applications

- Task scheduling
- BFS traversal
- Request handling
- Print queue
- Message queues in distributed systems`,
  },
  {
    id: 'lec-6',
    title: 'Binary Trees Introduction',
    topic: 'Trees',
    readTime: '18 min read',
    completed: false,
    courseId: 'course-1',
    content: `# Binary Trees Introduction

A binary tree is a hierarchical data structure where each node has at most two children, referred to as left and right child.

## Tree Terminology

- **Root**: Topmost node
- **Parent**: Node with children
- **Child**: Node descending from parent
- **Leaf**: Node with no children
- **Height**: Length of longest path from node to leaf
- **Depth**: Length of path from root to node

## Types of Binary Trees

### Full Binary Tree
Every node has 0 or 2 children

### Complete Binary Tree
All levels filled except possibly the last

### Perfect Binary Tree
All internal nodes have 2 children, all leaves at same level

### Balanced Binary Tree
Height difference between subtrees ≤ 1

## Traversal Methods

### Inorder (Left, Root, Right)
Gives sorted order for BST

### Preorder (Root, Left, Right)
Used for copying tree

### Postorder (Left, Right, Root)
Used for deleting tree

### Level Order
Visit nodes level by level (BFS)

## Time Complexity

- Search: O(n) worst case, O(log n) for balanced trees
- Insert: O(n) worst case, O(log n) for balanced trees
- Delete: O(n) worst case, O(log n) for balanced trees`,
  },
  {
    id: 'lec-7',
    title: 'Graph Representation',
    topic: 'Graphs',
    readTime: '16 min read',
    completed: false,
    courseId: 'course-2',
    content: `# Graph Representation

Graphs are non-linear data structures consisting of vertices (nodes) connected by edges. They're used to represent networks, relationships, and many real-world problems.

## Types of Graphs

### Directed vs Undirected
- **Directed**: Edges have direction (one-way)
- **Undirected**: Edges are bidirectional

### Weighted vs Unweighted
- **Weighted**: Edges have associated costs/values
- **Unweighted**: All edges are equal

## Representation Methods

### Adjacency Matrix
2D array where matrix[i][j] indicates edge from i to j

**Pros**: O(1) edge lookup
**Cons**: O(V²) space

### Adjacency List
Array of lists, each index stores neighbors

**Pros**: O(V+E) space, efficient for sparse graphs
**Cons**: O(V) edge lookup

### Edge List
List of all edges as pairs

**Pros**: Simple, space efficient
**Cons**: Slow lookups

## Common Algorithms

- BFS (Breadth-First Search)
- DFS (Depth-First Search)
- Dijkstra's Shortest Path
- Bellman-Ford
- Topological Sort
- Minimum Spanning Tree

## Applications

- Social networks
- Maps and navigation
- Web crawling
- Recommendation systems
- Network routing`,
  },
  {
    id: 'lec-8',
    title: 'Linked Lists Fundamentals',
    topic: 'Linked Lists',
    readTime: '14 min read',
    completed: true,
    courseId: 'course-3',
    content: `# Linked Lists Fundamentals

A linked list is a linear data structure where elements are stored in nodes, and each node points to the next node in the sequence. Unlike arrays, linked lists don't require contiguous memory locations.

## Node Structure

Each node contains:
- Data field(s)
- Pointer(s) to the next (and possibly previous) node

## Types of Linked Lists

### Singly Linked List
Each node points to the next node

### Doubly Linked List
Each node points to both next and previous nodes

### Circular Linked List
Last node points back to the first node

## Time Complexity

- Access: O(n)
- Search: O(n)
- Insert at beginning: O(1)
- Insert at end: O(n) or O(1) with tail pointer
- Delete: O(n)

## Advantages

- Dynamic size
- Efficient insertions/deletions
- No memory waste

## Disadvantages

- No random access
- Extra memory for pointers
- Not cache-friendly

## Common Operations

- Reversal
- Cycle detection
- Finding middle element
- Merging sorted lists`,
  },
];

export const userStats = {
  name: 'Alex Chen',
  email: 'alex.chen@example.com',
  joinDate: 'January 2024',
  tasksCompleted: 47,
  totalTasks: 150,
  currentStreak: 12,
  longestStreak: 28,
  badges: [
    { id: '1', name: 'First Steps', description: 'Complete your first task', earned: true },
    { id: '2', name: 'Week Warrior', description: '7-day streak', earned: true },
    { id: '3', name: 'Array Master', description: 'Complete all array tasks', earned: false },
    { id: '4', name: 'Speed Demon', description: 'Solve a hard problem in under 10 minutes', earned: true },
    { id: '5', name: 'Consistency King', description: '30-day streak', earned: false },
  ],
};
