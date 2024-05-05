---
title: PostgreSQL-自定义函数
article: false
category:
  - 中间件
  - PostgreSQL
---
## 自定义函数(存储过程)
```sql
CREATE [OR REPLACE] FUNCTION function_name (arguments)   
RETURNS return_datatype AS $variable_name$  
  DECLARE  
    declaration;  
    [...]  
  BEGIN  
    < function_body >  
    [...]  
    RETURN { variable_name | value }  
  END; 
LANGUAGE plpgsql;
```
- 规定
  - []表示可选
- [OR REPLACE]：替换现有函数。
- function_name：指定函数的名称。
- arguments:定义函数的参数
  - 语法：`[[argmode]argname argtype [default value],[[argmode]argname argtype],[…]];`
  - argmode:参数的模式
    - IN、OUT、INOUT，缺省值是IN。
  - argname：参数名字
  - argtype：参数的数据类型
  - default：默认参数。
  - 参数语法：
    - `模式 名称 类型`
- return_datatype：表示返回值类型。
- DECLARE：声明变量
  - 语法：`类型 名称`
- RETURNS：函数返回的数据类型
  - 如果存在OUT或则INOUT参数，则可以省略RETURNS
- function_body：function_body包含可执行部分。
- LANGUAGE：实现该函数的语言的名称。
- 定义动态sql语句：`sql1 := 'select * from AA where id=$1';`
- 传参并执行动态sql，并输出结果（结果在函数参数中用out定义）：`EXECUTE sql1 using id into result;`



