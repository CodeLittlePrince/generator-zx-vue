介绍
---
axios封装

使用方法（引入）
---
```js
import ajax from 'ajax'

// get
ajax.get('/api', {name: 'tom'})
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.error(err)
  })
// post
ajax.post('/api', {name: 'jerry'})
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.error(err)
  })

```

使用方法（全局）
```js
// get
this.$ajax.get('/api', {name: 'tom'})
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.error(err)
  })
// post
this.$ajax.post('/api', {name: 'jerry'})
  .then(res => {
  console.log(res)
  })
  .catch(err => {
  console.error(err)
  })

```