<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>

<div class="modal fade" id="stasticsUploadModel" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
      </div>
      <div class="modal-body">
             <form id="importFile" action="/statisticsRecord/importStasticsRecord" name="importFile" class="form-horizontal" method="post"  enctype="multipart/form-data">
                <div class="form-group">
                  <label class="control-label">请选择要导入的Excel文件：</label>
                  <input id="excelFile" name="excelUpload" class="file-loading" type="file" multiple accept=".xls,.xlsx"> <br>
                </div>
                <button type="submit" id="uploadBtn" class="btn btn-default btn_loading" ><span class="glyphicon glyphicon-ok"></span> 提交</button>
             </form>
       </div>
    </div>
  </div>
</div>