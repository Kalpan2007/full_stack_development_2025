
# MongoDB Assignment Workbook

**Dataset:** `db.companies` (20 SDE1 hiring companies)

---

## Section A. CRUD Basics (40 Queries)

1. Insert a new company document for "Tesla" in Bangalore with base = 29 LPA.

Query
```
db.companies.insertOne	({
  name : "Tesla",
  location : "Banglore",
  salryBand : {base:29}
})
```
Output
 ```
 {
  acknowledged: true,
  insertedId: ObjectId('68b6ce4997baa24ce7f9adc6')
}
 ```
2. Insert multiple new companies at once (add "Stripe" and "Coinbase").
Query
```
db.companies.insertMany([
  { name: "Stripe" },
  { name: "Coinbase" }
])
```
Output
 ```
 
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('68b6ce9397baa24ce7f9adc7'),
    '1': ObjectId('68b6ce9397baa24ce7f9adc8')
  }
}
 ```
3. Find all companies.
Query
```
db.companies.find({})
```
Output
 ```
 {
  {
  _id: ObjectId('68b6ccce97baa24ce7f9adb2'),
  name: 'Google',
  location: 'Bangalore',
  salaryBand: {
    base: 30,
    bonus: 5,
    stock: 10
  },...

  _id: ObjectId('68b6ce4997baa24ce7f9adc6'),
  name: 'Tesla',
  location: 'Banglore',
  salryBand: {
    base: 29
  }
}
}
 ```
4. Find one company (`findOne()`) in Bangalore.
Query
```
db.companies.findOne({
  location : 'Banglore'
})
```
Output
 ```
 {
  _id: ObjectId('68b6ce4997baa24ce7f9adc6'),
  name: 'Tesla',
  location: 'Banglore',
  salryBand: {
    base: 29
  }
}
 ```
5. Find companies offering base > 30 LPA.
Query
```
db.companies.find({
  "salaryBand.base": { $gt: 30 }
})
```
Output
 ```
{
  _id: ObjectId('68b6ccce97baa24ce7f9adb4'),
  name: 'Microsoft',
  location: 'Hyderabad',
  salaryBand: {
    base: 32,
    bonus: 6,
    stock: 15
  },
  .
  .
  .
 ```
6. Find companies in Hyderabad.
Query
```
db.companies.find({
  location : "Hyderabad"
})
```
Output
 ```
{
  _id: ObjectId('68b6ccce97baa24ce7f9adb3'),
  name: 'Amazon',
  location: 'Hyderabad',
  salaryBand: {
    base: 28,
    bonus: 3,
    stock: 12
  },
  hiringCriteria: {
    cgpa: 7,
    skills: [
        .
        .
        .
 ```
7. Find companies requiring CGPA >= 8.0.
Query
```
db.companies.find({
  "hiringCriteria.cgpa" : {$gte : 8}
})
```
Output
 ```
{
  _id: ObjectId('68b6ccce97baa24ce7f9adb4'),
  name: 'Microsoft',
  location: 'Hyderabad',
  salaryBand: {
    base: 32,
    bonus: 6,
    stock: 15
  },
  hiringCriteria: {
    cgpa: 8,
    .
    .
    .
 ```
8. Find companies that list "System Design" in skills.
Query
```
db.companies.find({
 "hiringCriteria.skills" : "System Design"
})
```
Output
 ```
{
  _id: ObjectId('68b6ccce97baa24ce7f9adb2'),
  name: 'Google',
  location: 'Bangalore',
  salaryBand: {
    base: 30,
    bonus: 5,
    stock: 10
  },
  hiringCriteria: {
    cgpa: 7.5,
    skills: [
      'DSA',
      'System Design',
      'Java'
    ],
    experience: '0-2 years'
  },
  interviewRounds: [
    {
      round: 1,
    .
    .
    .
 ```
9. Find companies that offer "Relocation".
Query
```
db.companies.find({
  benefits : "Relocation"
})
```
Output
 ```
{
  _id: ObjectId('68b6ccce97baa24ce7f9adb2'),
  name: 'Google',
  location: 'Bangalore',
  salaryBand: {
    base: 30,
    bonus: 5,
    stock: 10
  },
  hiringCriteria: {
    cgpa: 7.5,
    skills: [
      'DSA',
      'System Design',
      'Java'
    ],
    experience: '0-2 years'
  },
  interviewRounds: [
    {
      round: 1,
      type: 'Online Assessment'
    },
    {
      round: 2,
      type: 'Technical Interview'
    },
    {
      round: 3,
      type: 'Managerial Interview'
    },
    {
      round: 4,
      type: 'HR Round'
    }
  ],
  benefits: [
    'Relocation',
    'WFH',
    'Health Insurance'
  ],
    .
    .
    .
 ```
10. Find companies with stock >= 15 LPA.
Query
```
db.companies.find({
  "salaryBand.stock"  : {$gte : 15}
})
```
Output
 ```
{
  _id: ObjectId('68b6ccce97baa24ce7f9adb4'),
  name: 'Microsoft',
  location: 'Hyderabad',
  salaryBand: {
    base: 32,
    bonus: 6,
    stock: 15
  },
  hiringCriteria: {
    cgpa: 8,
    skills: [
      'DSA',
      'C#',
      'System Design'
    ],
    experience: '1-3 years'
  },
  interviewRounds: [
    {
      round: 1,
      type: 'OA'
    },
    {
      round: 2,
    .
    .
    .
 ```
11. Find companies with at least 4 interview rounds.
Query
```
db.companies.find({
  "interviewRounds.3": { $exists: true }
})
```
Output
 ```
{
  _id: ObjectId('68b6ccce97baa24ce7f9adb2'),
  name: 'Google',
  location: 'Bangalore',
  salaryBand: {
    base: 30,
    bonus: 5,
    stock: 10
  },
  hiringCriteria: {
    cgpa: 7.5,
    skills: [
      'DSA',
      'System Design',
      'Java'
    ],
    experience: '0-2 years'
  },
  interviewRounds: [
    {
      round: 1,
      type: 'Online Assessment'
    },
    {
      round: 2,
      type: 'Technical Interview'
    },
    {
      round: 3,
      type: 'Managerial
    .
    .
    .
 ```
12. Find companies with headcount > 5000.

Query
```
db.companies.find({
  "headcount" : {$gt : 5000}
})
```
Output
 ```
{
  _id: ObjectId('68b6ccce97baa24ce7f9adbf'),
  name: 'Infosys',
  location: 'Mysore',
  salaryBand: {
    base: 6,
    bonus: 1,
    stock: 0
  },
  hiringCriteria: {
    cgpa: 6,
    skills: [
      'DSA',
      'Java'
    ],
    experience: '0-1 years'
  },
  interviewRounds: [
    {
      round: 1,
      type: 'Aptitude'
    },
    {
      round: 2,
      type: 'Technical'
    },
    {
      round: 3,
      type: 'HR'
    }
  ],
  benefits: [
    'Training',
    'Relocation'
  ],
  headcount: 10000
}
    .
    .
    .
 ```
13. Insert a company with only `name` and `location`.

Query
```
db.companies.insertOne({
  name : "My Company",
  location : "Surat"
})
```
Output
 ```
 {
  acknowledged: true,
  insertedId: ObjectId('68b6d81b97baa24ce7f9adc9')
}
```
14. Update Amazon’s bonus to 6.

Query
```
db.companies.insertOne	({
  name : "Tesla",
  location : "Banglore",
  salryBand : {base:29}
})
```
Output
 ```
 {
  acknowledged: true,
  insertedId: ObjectId('68b6ce4997baa24ce7f9adc6')
}
```

15. Update all companies in Hyderabad to add benefit = "Free Snacks".

Query
```
db.companies.updateMany(
  { location: "Hyderabad" },
  { $push: { benefits: "Free Snacks" } }
)
```
Output
 ```
 {
  acknowledged: true,
  insertedId: null,
  matchedCount: 4,
  modifiedCount: 4,
  upsertedCount: 0
}
```
16. Add skill "Python" to Google’s criteria.

Query
```
db.companies.updateOne(
  { name: "Google" },
  { $push: { "hiringCriteria.skills": "Python" } }
)
```
Output
 ```
 {
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
```
17. Remove "Gym" from Microsoft benefits.

Query
```
db.companies.updateOne(
  { name: "Microsoft" },
  { $pull: { benefits: "Gym" } }
)
```
Output
 ```
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}}
```
18. Replace entire salaryBand for Netflix.

Query
```
db.companies.updateOne(
  {name : "Netflix"},
  {$set : {salarBand : {base:40,bonus:10,stock:5} } }
)
```
Output
 ```
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
```
19. Delete company "Infosys".

Query
```
db.companies.deleteOne({
  name : "Infosys"
})
```
Output
 ```
{
  acknowledged: true,
  deletedCount: 1
}
```
20. Delete all companies with base < 10.

Query
```
db.companies.deleteMany({
  "salaryBand.base" : {$lt : 10}
})
```
Output
 ```
{
  acknowledged: true,
  deletedCount: 1
}
```
21. Use `$set` to add a new field `isTopTier: true` for Google.

Query
```
db.companies.updateOne(
  { name: "Google" },
  { $set: { isTopTier: true } }
)
```
Output
 ```
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
```
22. Use `$inc` to increase Amazon’s stock by 2.

Query
```
db.companies.updateOne(
  { name: "Amazon" },
  { $inc: { "salaryBand.stock": 2 } }
)
```
Output
 ```
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
```
23. Use `$rename` to rename field `headcount` → `employeeCount`.

Query
```
db.companies.updateMany(
  {},
   { $rename: { "headcount": "employeeCount" } }
)
```
Output
 ```
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 21,
  modifiedCount: 17,
  upsertedCount: 0
}
```
24. Use `$unset` to remove "bonus" from salaryBand.

Query
```
db.companies.updateMany({}, { $unset: { "salaryBand.bonus": "" } })
```
Output
 ```
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 22,
  modifiedCount: 17,
  upsertedCount: 0
}
```
25. Insert 5 dummy companies with minimal fields.

Query
```
db.companies.insertMany([
  { name: "c1", location: "Pune" },
  { name: "c2", location: "Chennai" },
  { name: "c3", location: "Kolkata" },
  { name: "c4", location: "Ahmedabad" },
  { name: "c5", location: "Jaipur" }
])
```
Output
 ```
{
  acknowledged: true,
  insertedIds: {
    '0': ObjectId('68b6def697baa24ce7f9adca'),
    '1': ObjectId('68b6def697baa24ce7f9adcb'),
    '2': ObjectId('68b6def697baa24ce7f9adcc'),
    '3': ObjectId('68b6def697baa24ce7f9adcd'),
    '4': ObjectId('68b6def697baa24ce7f9adce')
  }
}
```
26. Delete all dummy companies.

Query
```
db.companies.deleteMany(
  { name: { $in: ["c1", "c2", "c3", "c4", "c5"] } }
)
```
Output
 ```
{
  acknowledged: true,
  deletedCount: 5
}
```
27. Find all companies, project only `name` and `salaryBand`.

Query
```
db.companies.find({}, { name: 1, salaryBand: 1})
```
Output
 ```
{
  _id: ObjectId('68b6ccce97baa24ce7f9adb2'),
  name: 'Google',
  salaryBand: {
    base: 30,
    bonus: 5,
    stock: 10
  }
}
.
.
.
```
28. Find all companies, exclude `_id`.

Query
```
db.companies.find(
  {},
  { _id: 0 }
)
```
Output
 ```
{
  name: 'Google',
  location: 'Bangalore',
  salaryBand: {
    base: 30,
    bonus: 5,
    stock: 10
  },
  hiringCriteria: {
    cgpa: 7.5,
    skills
.
.
.
```
29. Find only `name` and `benefits` for Microsoft.

Query
```
db.companies.find({name : "Microsoft"} , {name:1,salaryBand:1})
```
Output
 ```
 {
  _id: ObjectId('68b6ccce97baa24ce7f9adb4'),
  name: 'Microsoft',
  salaryBand: {
    base: 32,
    bonus: 6,
    stock: 15
  }
}
```
30. Count all companies in Bangalore.

Query
```
db.companies.find({ location: "Bangalore" }).count()
```
Output
```
09
```
31. Count all companies requiring CGPA >= 7.0.

Query
```
db.companies.find({ "hiringCriteria.cgpa": {$gte : 7} }).count()
```
Output
```
14
```
32. Get distinct locations.

Query
```
db.companies.find({ "hiringCriteria.cgpa": {$gte : 7} }).count()
```
Output
```
14
```
33. Get distinct benefits offered.

Query
```
db.companies.distinct("benefits")
```
Output
```
[
  'Device Discounts',
  'Free Food',
  'Free Lunch',
  'Free Meals',
  'Free Snacks',
  'Free Streaming',
  'Health Insurance',
  'Relocation',
  'Stock Options',
  'WFH'
]
```
34. Check if any company offers stock = 20.

Query
```
db.companies.find(
  {"salaryBand.Stock" :  20}
)
```
Output
```
No Output
```
35. Insert company with nested object `{ perks: { transport: true } }`.

Query
```
db.companies.insertOne({
  name: "NewCo",
  location: "Mumbai",
  perks: {
    transport: true
  }
})
```
Output
```
{
  acknowledged: true,
  insertedId: ObjectId('68b6e5d3d6c7b125ba4cf249')
}
```

36. Push new round `{ round: 5, type: "CTO Interview" }` to Meta.

Query
```
db.companies.updateOne(
  { name: "Meta" },
  { $push: { interviewRounds: { round: 5, type: "CTO Interview" } } }
)
```
Output
```
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
```
37. Pull "HR" round out of Amazon’s rounds.

Query
```
db.companies.updateOne(
  { name: "Amazon" },
  { $pull: { interviewRounds: { type: "HR" } } }
)
```
Output
```
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
``` 
38. Add "Health Insurance" only if not present in Swiggy benefits.

Query
```
db.companies.updateOne({ name: "Swiggy" }, { $addToSet: { benefits: "Health Insurance" } })
```
Output
```
{
  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
```
39. Increase base salary by 2 for all companies in Bangalore.

Query
```
db.companies.updateMany(
  {location : "Banglore"},
  {$inc : {"salaryBand.base" : 2} }
)
```
Output
```

  acknowledged: true,
  insertedId: null,
  matchedCount: 1,
  modifiedCount: 1,
  upsertedCount: 0
}
```
40. Delete all companies in "Delhi" (if any exist).

query 
```
db.companies.deleteMany(
  {location : "Delhi"}
)
```

Output 
```
{
  acknowledged: true,
  deletedCount: 0
}
```
---

## Section B. Advanced Queries (60 Queries)

41. Find companies with base between 25–35.
42. Find companies where stock < 10.
43. Find companies with bonus > 5 AND stock > 10.
44. Find companies with base >= 30 OR stock >= 12.
45. Find companies NOT requiring "OS".
46. Find companies requiring at least one skill from \["Java", "C++"].
47. Find companies requiring BOTH "DSA" and "System Design".
48. Find companies not offering WFH.
49. Find companies with > 3 benefits.
50. Find companies with exactly 4 interview rounds.
51. Find companies where employeeCount > 2000.
52. Find companies offering salaries in multiples of 5.
53. Find companies where CGPA is in \[6.5, 7.0, 7.5].
54. Find companies not in Bangalore.
55. Use regex to find skills ending in "Design".
56. Use regex to find companies starting with "A".
57. Case-insensitive search for "amazon".
58. Find companies where `salaryBand.stock` exists.
59. Find companies where `perks` does NOT exist.
60. Find companies where `salaryBand.base` is of type number.
61. Sort companies by base ascending.
62. Sort companies by base descending.
63. Sort by bonus, then stock.
64. Limit results to top 5 highest base salary.
65. Skip first 5 and return next 5.
66. Find company with maximum base salary.
67. Find company with minimum CGPA requirement.
68. Return first 3 companies alphabetically by name.
69. Find companies with at least one "Technical" interview round.
70. Find companies where round 2 is "System Design".
71. Find companies where interviewRounds length > 3.
72. Find companies where second benefit = "WFH".
73. Use `$all` to find companies requiring \["DSA", "Java"].
74. Use `$elemMatch` for base > 25 and stock > 5 in salaryBand.
75. Use `$in` for location in \["Hyderabad", "Bangalore"].
76. Use `$nin` for location not in \["Mumbai", "Pune"].
77. Find company closest to base = 30.
78. Use `$not` to exclude base < 20.
79. Use `$expr` to find companies where bonus < base/10.
80. Use `$size` to find companies with exactly 2 benefits.
81. Project new field `totalComp = base+bonus+stock`.
82. Find companies where totalComp > 45.
83. Sort companies by totalComp descending.
84. Use `$mul` to multiply stock by 2.
85. Use `$max` to ensure bonus >= 5.
86. Use `$min` to cap base salary at 35.
87. Use `$addToSet` to ensure unique benefit "WFH".
88. Use arrayFilters to update only 3rd round = "Tech Screen".
89. Update multiple docs with `$currentDate` for `lastUpdated`.
90. Delete companies without benefits field.
91. Upsert: Update "Tesla" if exists, insert if not.
92. Find all companies but exclude "salaryBand".
93. Project only name and computed field `doubleStock = stock*2`.
94. Match companies whose name length = 6 using `$expr`.
95. Query with `$mod`: base % 2 = 0.
96. Query with `$where`: headcount > 2000.
97. Query using `$text` after creating text index on `skills`.
98. Use collation for case-insensitive sort by name.
99. Query with `$type: "array"` on benefits.
100. Find companies where "Free Meals" is one of the benefits.

---

## Section C. Aggregations (100 Queries)

101. `$match` companies with base >= 30.
102. `$project` name + base only.
103. `$project` new field `totalComp`.
104. `$group` avg base per location.
105. `$group` max base per company.
106. `$group` min CGPA per location.
107. `$group` total headcount by location.
108. `$sort` by base.
109. `$sort` by totalComp.
110. `$limit` to 3 top-paying companies.
111. `$skip` first 5.
112. `$count` companies in Bangalore.
113. `$unwind` benefits.
114. `$group` count of each unique benefit.
115. `$unwind` interviewRounds.
116. `$group` by interview type, count frequency.
117. `$lookup` join with `candidates` collection.
118. `$facet` pipeline → salaries vs benefits.
119. `$bucket` base salaries into \[0–10, 11–20, 21–30, 31–40].
120. `$bucketAuto` for salaryBand.base into 4 buckets.
121. `$match` companies offering "Stock Options".
122. `$project` to hide headcount.
123. `$project` boolean field `isHighPaying: base > 30`.
124. `$group` avg stock by location.
125. `$group` totalComp sum per company.
126. `$sort` by CGPA requirement descending.
127. `$match` + `$group` → avg salary only in Hyderabad.
128. `$lookup` join Student–Course schema.
129. `$lookup` join Post–User schema.
130. `$replaceRoot` to flatten salaryBand.
131. `$set` new field `salaryBand.total`.
132. `$addFields` skillCount = `$size: skills`.
133. `$match` + `$project` → only companies with > 2 skills.
134. `$group` → number of companies per skill.
135. `$unwind` skills.
136. `$group` skill popularity across companies.
137. `$sort` skill popularity descending.
138. `$lookup` join companies with interview database.
139. `$cond` → tag "premium" if base > 30.
140. `$ifNull` → set bonus = 0 if null.
141. `$switch` → assign rating based on base salary ranges.
142. `$regexMatch` to filter names ending in "s".
143. `$merge` results into `salaryAnalysis` collection.
144. `$out` write salary analysis into `analysis` collection.
145. `$group` → total base per benefit.
146. `$group` → count companies with WFH.
147. `$sort` → companies with most benefits.
148. `$unwind` + `$group` → average CGPA per skill.
149. `$group` → avg interview rounds per location.
150. `$count` → number of interview types across dataset.
     151–200: Additional 50 queries combining `$match`, `$group`, `$project`, `$facet`, `$lookup`, `$bucket`, `$cond`, `$addFields` to cover every aggregation operator.

---

## Section D. Indexing & Performance (40 Queries)

201. Create index on `name`.
202. Create compound index on `location + salaryBand.base`.
203. Create text index on `skills`.
204. Use `$text` search "Java".
205. Create index on `salaryBand.stock`.
206. Use `.explain("executionStats")` on a query.
207. Drop index on `name`.
208. Create unique index on `name`.
209. Create sparse index on `benefits`.
210. Create partial index for base > 25.
211. Query with text index sorted by score.
212. Create collation for case-insensitive `name`.
213. Compound index on \[location, headcount].
214. Covered query with projection.
215. Multi-key index for `benefits` array.
216. Test performance with vs without index.
217. Use `.hint()` to force index.
218. Wildcard index for dynamic keys.
219. TTL index for `postedAt`.
220. Hashed index on `name` (sharding).
221. Background index creation.
222. Drop all indexes.
223. Recreate index on CGPA.
224. Unique + partial index on location = Bangalore.
225. Explain plan for range query.
226. Create text + compound index.
227. Covered query example for base + stock.
228. Query sorted by compound index fields.
229. Explain stats for regex query.
230. Paginate using index on base.
231. Paginate using skip-limit.
232. Compare pagination performance.
233. Test query with array index.
234. Index nested field `hiringCriteria.cgpa`.
235. Drop index on benefits.
236. Rebuild all indexes.
237. Analyze query cache.
238. Use `.hint()` wrong index and observe.
239. Index with case-insensitive collation.
240. Multi-field partial index.

---

## Section E. Bonus Challenges (40 Queries)

241. Find **top 5 highest-paying companies** that also offer WFH.
242. Find companies with **avg salary > 30 LPA** grouped by location.
243. Find **companies requiring DSA** and sort by totalComp.
244. Find **companies where base > avg(base)**.
245. Bucket companies by **CGPA requirement**.
246. Find **most common skill** required across companies.
247. Find **most common benefit** offered.
248. Rank companies by **salary in each location**.
249. Dashboard pipeline: `{ location, avgSalary, topCompany }`.
250. Count **average interview rounds** per company.
251. Find companies with both "Stock Options" and "Relocation".
252. Find total employees across all Bangalore companies.
253. Find company with **highest stock** in salary.
254. Find company with **lowest bonus**.
255. Find **all skills required across all companies**.
256. Count **unique interview types** across dataset.
257. Create a leaderboard of **companies by headcount**.
258. Find **companies offering device discounts**.
259. Find **companies where benefits > skills count**.
260. Nested populate simulation (companies ↔ candidates).
261. Find **average stock by location**.
262. Find **companies where salary > 1.5x avg salary**.
263. Find **locations with more than 3 companies**.
264. Find **companies in Bangalore with WFH and >25 base**.
265. Find **companies that don’t require CGPA >= 7.5**.
266. Find **top 3 companies by interview rounds count**.
267. Find **distribution of salaries into 5 bands**.
268. Build a **search API** style query with `$text` + `$meta`.
269. Count **companies by experience requirement**.
270. Find **companies offering both Free Meals and Free Lunch**.
271. Find **location with highest avg stock**.
272. Rank **skills by frequency** across dataset.
273. Find **company offering stock + base > 40**.
274. Find **companies requiring Java but not System Design**.
275. Find **companies where interview type = "Culture Fit"**.
276. Find **companies where base > stock+bonus**.
277. Find **company with maximum total compensation**.
278. Build a pipeline to compute **salary percentiles**.
279. Group companies by **benefit count**.
280. Output final dashboard:

```
{
  totalCompanies,
  avgBase,
  mostCommonSkill,
  mostCommonBenefit,
  highestPayingCompany
}
```

---
