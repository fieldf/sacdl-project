var Utils = (function() {
    var treeData;

    return {
        getData: function(data) {
            // treeData = data;
            treeData=getZlData(data);
        },

        /**
         Data format:
        {
            labels: [
                'c/c++', 'python', 'javascript',
                'java', 'ruby', 'html'
            ],
            series: [{
                label: 'Projects count',
                values: [4, 8, 15, 16, 23, 42] //counts
            }]
        }
        */
        getBarData: function() {
            var items = treeData.children;
            var result = {
                    labels: [],
                    series: []
                },
                values = [];

            items.forEach(function(item) {
                result.labels.push(item.name);
                values.push(item.children.length);
            })

            result.series.push({
                label: 'Projects count',
                values: values
            })

            return result;
        },

        /**
                 [
                 { name: "repos" , 
                   languages: [  { language: 'js', count: 3000 },
                             { language: 'ruby', count: 1300 }]
                ];
                 */
        getStackData: function() {
            var items = treeData.children;

            var result = {
                name: "repos",
                languages: []
            }

            //1. 确定初始数据
            items.forEach(function(item) {
                if (item.name === "null") {
                    return
                };
                var child = {
                    language: item.name,
                    count: item.children.length
                };

                result.languages.push(child);
            })

            return [result];
        },
        /** Data format:
            {
                    "name": "languages",
                    "children": [{
                        "name": "javascript",
                        "children": [{
                            "name": "imfly/myIDE",
                            "watchers_count": 100,
                            "forks_count": 50
                        }]
                    }]
            }
           */
        getTreeData: function(dataSet) {
            return treeData;
        }
        

    }

    function getZlData(dataSet) {
        var languages = {};
        //  新建根节点
        var result = {
            "name": "languages",
            "children": []
        }

        // 循环处理子节点
        if (dataSet && dataSet.items) {
            var items = dataSet.items;

            // 先找出涉及语言
            items.forEach(function(item, index) {
                if (typeof languages[item.language] === "undefined") {
                    languages[item.language] = index;
                };
            })
        

            // 根据语言进行整理
            for (var language in languages) {
                // 有些版本库，是没有语言信息的。Github的语言识别并不是完美的
                if (language==="null") {
                    language="others";
                };

                // 每种语言的子节点
                var root = {
                    "name": language,
                    "children": []
                };

                // 从全局数据中再次查找我们的数据
                items.forEach(function(item, index) {
                    var child = {
                        "name": item.full_name,
                        "watchers_count": item.watchers_count,
                        "forks_count": item.forks_count
                    };

                    if (item.language === language || (item.language === "null" && language==="others")) {
                        root.children.push(child);
                    };
                })

                result.children.push(root);
            }
            
        }
        // 返回结果
        return result;
    }
}())
