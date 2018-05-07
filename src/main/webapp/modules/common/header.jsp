<%@ page language="java" pageEncoding="UTF-8"%>
<script type="text/javascript">
var path = '${path}';
</script>

<div class="navbar  navbar-inverse" role="navigation">
  <div class="container-fluid">
    <div class="navbar-header">
      <a href="/product" class="navbar-brand"><span class="glyphicon glyphicon-fire"></span> 产品首页</a>
    </div>
    <div class="navbar-collapse collapse" id="navbar-main">
      <ul class="nav navbar-nav">
	        	<li class="dropdown">
	        	   <a class="dropdown-toggle" data-toggle="dropdown" href="#"><spanclass="caret">产品管理</span></a>
	        	   <ul class="dropdown-menu">
						<li><a href="/product">产品管理</a></li>
						<li><a href="/productRule">产品规则管理</a></li>
						<li><a href="/preOrder">产品预约管理</a></li>
						<li><a href="/label">产品标签管理</a></li>
					</ul> 
	        	</li>
	  </ul>
	  <ul class="nav navbar-nav">
	        	<li class="dropdown">
	        	   <a class="dropdown-toggle" data-toggle="dropdown" href="#"><spanclass="caret">基础管理</span></a>
	        	   <ul class="dropdown-menu">
						<li><a href="/sysDict">字典数据管理</a></li>
					</ul> 
	        	</li>
	  </ul>
      <ul class="nav navbar-nav navbar-right" style="font-size: 12px;font-weight: normal;">
        <li class="dropdown"><a class="dropdown-toggle" data-toggle="dropdown" href="#" id="download">admin <span class="caret"></span></a>
          <ul class="dropdown-menu" aria-labelledby="download">
            <li><a href="./bootstrap.min.css">设置</a></li>
            <li><a href="/login/logout">退出</a></li>
          </ul></li>
      </ul>
    </div>
  </div>
</div>