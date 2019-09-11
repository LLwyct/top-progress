# top-progress
this is a very very very light weight web progressbar at the top of the document.

这是一个非常非常轻量的网页顶部进度条。

## Usage
1.  add ```<script src="tp.js"></script>``` at the end of ```<body></body>```

    add```<link rel="stylesheet" href="./src/tp.style.css">```

2. add
    ```html
    <script>
        const bar = new TP(options={

        });
    </script>
    ```
    options:
     - mount：将该组件挂载在哪个元素上，默认为'body'
     - color：进度条的颜色，默认为'lightblue'

3. 提供start、done、add三个函数
    - void start()：进度条滚动，若不主动执行done，则会越来越慢
    - void done()：进度条滚动到底，并且初始化
    - int add(len)：无条件增加len%，最大值为100%

4. example
    ```html
    <script src="./src/tp.js"></script>
    <script>
        const bar = new TP({
            mount: 'body',
            color: '#c471f5'
        });
        function start () {
            bar.start();
        }
        function add(x) {
            bar.add(x);
        }
        function done () {
            bar.done();
        }
    </script>
    ```
