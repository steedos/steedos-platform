---
name: steedos-files
description: |
  Builder6 file upload/download system. Supports local filesystem and AWS S3
  storage. API at /api/v6/files/:collectionName. Covers multipart upload
  with FileInterceptor, collection naming (cfs.files.filerecord, cfs.avatars,
  cfs.images), storage path conventions (object_name/YYYY/MM/), S3 presigned
  URLs, direct download streaming, Meteor collection name compatibility,
  MD5 checksums, and public download configuration.
---

# Builder6 Files | Builder6 文件系统

## Overview | 概述

The Files module (`@builder6/files`) provides file upload, download, and management with dual storage support: local filesystem and AWS S3. File metadata is stored in MongoDB with Meteor-compatible collection names.

## Storage Types | 存储类型

Configured via `B6_CFS_STORE` (or `configService.get('cfs.store')`):

| Type | Description |
|------|-------------|
| `local` (default) | Files stored in `B6_STORAGE_DIR/files/{collection}/` |
| `S3` | Files stored in AWS S3 bucket |

## Collection Names | 集合名称

| Collection | Alias | Purpose |
|------------|-------|---------|
| `cfs.files.filerecord` | `files` | General file attachments |
| `cfs.avatars.filerecord` | `avatars` | User avatars |
| `cfs.images.filerecord` | `images` | Image files |

Short names (`files`, `avatars`, `images`) are auto-mapped to full names for Meteor compatibility.

## API Endpoints | API 端点

### Upload File | 上传文件

```
POST /api/v6/files/:collectionName
```

**Guard**: `AuthGuard`. **Content-Type**: `multipart/form-data`

| Field | Type | Description |
|-------|------|-------------|
| `file` | binary | File to upload (required) |
| `object_name` | string | Associated object name |
| `record_id` | string | Associated record ID |
| `parent` | string | Parent record ID |

**Response**: Saved file record with `_id`, `original`, `metadata`, `copies`.

### Download File | 下载文件

```
GET /api/v6/files/:collectionName/:fileId
GET /api/v6/files/:collectionName/:fileId/:fileName
```

| Query Param | Default | Description |
|-------------|---------|-------------|
| `redirect` | `true` | Redirect to S3 signed URL (S3 only) |
| `download` | `false` | Force `Content-Disposition: attachment` |

When `cfsStore === 'S3'` and `redirect=true`, returns 302 redirect to presigned URL.

For auth: public collections (configured via `B6_CFS_DOWNLOAD_PUBLIC`, default: `avatars`) allow anonymous download. Others require authentication.

### Download Direct | 直接下载

```
GET /api/v6/files/download/:collectionName/:fileId/:fileName
```

Always streams file directly (no S3 redirect).

### Get Presigned URLs | 获取预签名 URL

```
POST /api/v6/files/:collectionName/presigned-urls
Body: { "records": ["fileId1", "fileId2"] }
Response: { "urls": ["https://s3...", "https://s3..."] }
```

S3 presigned URLs expire in 1 hour.

## File Storage Path | 文件存储路径

### Local Storage | 本地存储

```
{B6_STORAGE_DIR}/files/{collectionFolder}/{object_name}/{YYYY}/{MM}/{uuid}-{filename}
```

Example: `./steedos-storage/files/files/orders/2026/04/abc123-invoice.pdf`

### S3 Storage

```
{collectionFolder}/{object_name}/{YYYY}/{MM}/{uuid}-{filename}
```

## File Record Schema | 文件记录结构

```json
{
  "_id": "uuid",
  "original": {
    "type": "application/pdf",
    "size": 12345,
    "name": "invoice.pdf",
    "md5": "abc123..."
  },
  "metadata": {
    "owner": "userId",
    "space": "spaceId",
    "object_name": "orders",
    "record_id": "orderId",
    "parent": "parentId"
  },
  "uploadedAt": "2026-04-18T...",
  "copies": {
    "files": {
      "name": "invoice.pdf",
      "type": "application/pdf",
      "size": 12345,
      "key": "orders/2026/04/uuid-invoice.pdf",
      "updatedAt": "...",
      "createdAt": "..."
    }
  }
}
```

## S3 Configuration | S3 配置

```bash
B6_CFS_STORE=S3
B6_CFS_AWS_S3_ENDPOINT=https://s3.amazonaws.com
B6_CFS_AWS_S3_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
B6_CFS_AWS_S3_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
B6_CFS_AWS_S3_REGION=us-east-1
B6_CFS_AWS_S3_BUCKET=my-bucket
B6_CFS_AWS_S3_FORCE_PATH_STYLE=true
```
