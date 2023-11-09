# standalone static blog generator

I created this project because I feel exhausted, everytime I tried to update my own static blog that was built using `jekyll`, something always broke. Mind you, I'm not anywhere near good using `ruby`, so, whenever `gem bundle` dependencies broke, or `jekyll` failed to serve, I don't know how to fix that easily without looking it up on the internet, which often required me to just generate new `jekyll` and all of my blog posts and contents to this new project.

I'm spent.

So, I created this project. My purpose is to create a single executable solution to my problem. And I added GUI just to make it feel more *standalone*.

I'm dumb, so I used `electron` since it's the easiest. I glued some script together (using `javascript`).

When you press `SET DIR`, choose a directory. It will check wether inside of the directory contains these particular directories:

- `_include`
- `_layout`
- `_post`
- `_page`
- `public` *as default build directory*

If any of the said directory isn't existed, it will create the corresponding directory.

On the menu, you can choose either of these:

- `CONFIG`
- `INCLUDE`
- `LAYOUT`
- `POST`
- `PAGE`

Below is the list of `menu` in this application.

## CONFIG
**future** - **under construction**

## INCLUDE
You can add `include` template using `html`

## LAYOUT
You can add `layout` template using `html`

Command supported for either `include` or `layout` documents:

- `if` `else`
- `include`

## POST
You can add `post` using `md`. You can specify `post` config on top of the generated document. The config is written with these format:
```yml
---
layout: post 
title: example title 
permalink: /example-title
date: 2023-11-09 10:25 +0700
categories: code
comments: true
---
```
Then you can write `post` content under config.

Command supported inside `post` document:

- `highlight`
- `post_url`

`post` config description

|config        |description                                          |
|--------------|-----------------------------------------------------|
|**layout**    |search inside `_layout` and applied to post document |
|**title**     |saved as `post.title`. can be accessed globally      |
|**permalink** |if specified, `post` will be generated in accordance to specified path, else, it will be generated to `/post/title`|
|**date**      |saved as `post.date`                                 |
|***args**     |saved as `post.*args`                                |