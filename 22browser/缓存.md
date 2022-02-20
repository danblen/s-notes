|      名称      |                            生命期                            | 大小 |                         与服务器通信                         |
| :------------: | :----------------------------------------------------------: | :--: | :----------------------------------------------------------: |
|     cookie     | 一般由服务器生成，可设置失效时间。如果在浏览器端生成Cookie，默认是关闭浏览器后失效 | 4KB  | 每次都会携带在HTTP头中，如果使用cookie保存过多数据会带来性能问题 |
|  localStorage  |                 除非手动被清除，否则永久保存                 | 5MB  |               仅在浏览器中保存，不与服务器通信               |
| sessionStorage |         仅在当前会话下有效，关闭页面或浏览器后被清除         | 5MB  |               仅在浏览器中保存，不与服务器通信               |

**4. 浏览器端缓存的分类**

下面这张图展示了某一网站，对不同资源的请求结果，其中可以看到有的资源直接从缓存中读取，有的资源跟服务器进行了再验证，有的资源重新从服务器端获取。 

- 200 from cache
- 304 not modified

注意，我们讨论的所有关于缓存资源的问题，都仅仅针对 GET 请求。而对于 POST , DELETE , PUT 这类行为性操作通常不做任何缓存。

**5. Cache-Control和Expires**

- Cache-Control是HTTP1.1中新增的响应头，使用的是相对时间
- Expires是HTTP1.0中的响应头，指定的是具体的过期日期而不是秒数。服务器跟客户端可能存在时钟不一致的情况，所以最好还是使用Cache-Control.  
- 同时使用Cache-Control会覆盖Expires

**6. Cache-Control都可以设置哪些属性**

- max-age（单位为s）

指定设置缓存最大的有效时间，定义的是时间长短。当浏览器向服务器发送请求后，在max-age这段时间里浏览器就不会再向服务器发送请求了。

- public

指定响应可以在代理缓存中被缓存，于是可以被多用户共享。如果没有明确指定private，则默认为public。

- private

响应只能在私有缓存中被缓存，不能放在代理缓存上。对一些用户信息敏感的资源，通常需要设置为private。

- no-cache

表示必须先与服务器确认资源是否被更改过（依靠If-None-Match和Etag），然后再决定是否使用本地缓存。

- no-store

绝对禁止缓存任何资源， 每次都会下载完整的资源。通常用于机密性资源。 

**7.新鲜度限值**

HTTP通过缓存将服务器资源的副本保留一段时间，这段时间称为新鲜度限值。这在一段时间内请求相同资源不会再通过服务器。HTTP协议中Cache-Control 和 Expires可以用来设置新鲜度的限值 

html代码

```
<html>
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <meta http-equiv="X-UA-Compatible" content="IE=EDGE" />
    <title>Web Cache</title>
    <link rel="shortcut icon" href="./shortcut.png">
    <script>
    </script>
  </head>
  <body class="claro">
  <img src="./cache.png">
  </body>
</html>
```

node服务端代码

```
var http = require('http');
var fs = require('fs');
http.createServer(function(req, res) {
    if (req.url === '/' || req.url === '' || req.url === '/index.html') {
        fs.readFile('./index.html', function(err, file) {
            console.log(req.url)
            //对主文档设置缓存，无效果
            res.setHeader('Cache-Control', "no-cache, max-age=" + 5);
            res.setHeader('Content-Type', 'text/html');
            res.writeHead('200', "OK");
            res.end(file);
        });
    }
    if (req.url === '/cache.png') {
        fs.readFile('./cache.png', function(err, file) {
            res.setHeader('Cache-Control', "max-age=" + 5);//缓存五秒
            res.setHeader('Content-Type', 'images/png');
            res.writeHead('200', "Not Modified");
            res.end(file);
        });
    }
    
}).listen(8888);
```

当在5秒内第二次访问页面时，浏览器会直接从缓存中取得资源

