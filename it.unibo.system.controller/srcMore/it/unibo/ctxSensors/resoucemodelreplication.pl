%====================================================================================
% Context ctxSensors  SYSTEM-configuration: file it.unibo.ctxSensors.resoucemodelReplication.pl 
%====================================================================================
context(ctxsystemcontroller, "localhost",  "TCP", "8032" ).  		 
context(ctxsensors, "localhost",  "TCP", "8033" ).  		 
%%% -------------------------------------------
qactor( worldobserver , ctxsystemcontroller, "it.unibo.worldobserver.MsgHandle_Worldobserver"   ). %%store msgs 
qactor( worldobserver_ctrl , ctxsystemcontroller, "it.unibo.worldobserver.Worldobserver"   ). %%control-driven 
qactor( controller , ctxsystemcontroller, "it.unibo.controller.MsgHandle_Controller"   ). %%store msgs 
qactor( controller_ctrl , ctxsystemcontroller, "it.unibo.controller.Controller"   ). %%control-driven 
qactor( temperature , ctxsensors, "it.unibo.temperature.MsgHandle_Temperature"   ). %%store msgs 
qactor( temperature_ctrl , ctxsensors, "it.unibo.temperature.Temperature"   ). %%control-driven 
%%% -------------------------------------------
%%% -------------------------------------------

