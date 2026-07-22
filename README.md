# n8n-nodes-seafile-lazy

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

## A lazy-loading Seafile integration node for n8n

This is a fork of the original [n8n-nodes-seafile](https://www.npmjs.com/package/n8n-nodes-seafile) community node with a focus on improving folder and file selection for large Seafile libraries.

The project is maintained by Sergey Shinkarenko and introduces lazy loading for Seafile resources to solve issues with loading large folder structures.

Repository:
https://github.com/shaman-rostov/n8n-nodes-seafile

NPM package:
https://www.npmjs.com/package/n8n-nodes-seafile-lazy

---

## Why this fork exists

This fork was created to fix a folder selection issue in the original Seafile n8n node.

The original implementation loaded the complete folder and file structure when opening the resource picker.

For large Seafile libraries with many folders and files, this could cause:

- the folder picker to become unresponsive
- extremely long loading times
- inability to select folders
- workflow configuration problems

The issue was caused by loading the entire directory structure upfront instead of loading resources only when needed.

---

## Main improvement: Lazy loading for folders and files

The main improvement in this fork is the **Seafile Lazy** node.

Instead of fetching the complete Seafile library tree during node configuration, folders and files are loaded on demand when users navigate through the structure.

This provides:

- On-demand folder loading
- Better handling of large folder structures
- Responsive resource selection
- Reduced unnecessary API requests
- More reliable workflow configuration

---

## About this node

The Seafile Lazy node allows you to automate work in Seafile and integrate Seafile with other applications.

It supports:

- Uploading files
- Downloading files
- Creating upload links
- Creating download links
- Tagging files in a Seafile library

Folder and file selection is resolved dynamically using lazy loading instead of loading the complete library structure upfront.

---

## Background

This project started from a real-world issue discovered while using n8n with a large Seafile installation.

The original community node worked correctly with smaller libraries but became difficult to use when selecting folders from a large file structure.

The solution was to replace eager folder loading with lazy loading, package the improved node, and make it available as a separate npm package.

---

## How to use Seafile Lazy in n8n

Currently, n8n is not shipped with this Seafile node. Therefore an installation of the community module is required.

---

## Credentials / Authentication

To authenticate this Seafile node for n8n against a Seafile Server, you will have to provide:

- **Seafile Server URL**: The URL of the Seafile server. This should be the base URL of the Seafile instance you want to connect to.
- **Account Token**: Required to authenticate requests and interact with the Seafile API.

The account token has to be generated with your login credentials.

More information:

https://seafile-api.readme.io/reference/post_api2-auth-token

The Library/Repo API Token is not supported because it provides access only to a limited number of endpoints.

---

## Installation of this community node

1. Open your n8n server.
2. Go to **Settings > Community Nodes**.
3. Select **Install**.
4. Enter:

```
n8n-nodes-seafile-lazy
```

in **Enter npm package name**.

5. Agree to the risks of installing community nodes:

```
I understand the risks of installing unverified code from a public source
```

6. Select **Install**.

After installing the node, you can use it like any other node.

n8n displays the node as **Seafile Lazy** in search results in the **Nodes** panel.

---

## License

[MIT](https://github.com/n8n-io/n8n-nodes-starter/blob/master/LICENSE.md)

---

## Local development

Read more at:

https://docs.n8n.io/integrations/creating-nodes/build/declarative-style-node/#test-your-node

### 1. Install n8n globally

```bash
npm install n8n -g
```

### 2. Clone this repository

```bash
git clone git@github.com:shaman-rostov/n8n-nodes-seafile.git
```

### 3. Install dependencies and build

```bash
npm install
npm run build
npm link
```

### 4. Link the node with your local n8n installation

```bash
cd ~/.n8n/nodes
npm link n8n-nodes-seafile-lazy
```

### 5. Start development mode

Run two consoles:

```bash
# In the node directory
npm run dev
```

and:

```bash
n8n start
```

The development build will update automatically after changes.
