---
title: Ubuntu partition 扩展分区
---


## Ubuntu 22 扩展分区
这台vm虚拟机中需要扩展的是 /dev/mapper/ubuntu--vg-ubuntu--lv

一阶段
1. **扩展物理卷**：
   ```sh
   sudo pvresize /dev/sda3
   ```

2. **扩展逻辑卷**：
   ```sh
   sudo lvextend -l +100%FREE /dev/mapper/ubuntu--vg-ubuntu--lv
   ```

3. **扩展文件系统**：
   ```sh
   sudo resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv
   ```

4. **验证磁盘空间**：
   ```sh
   df -h
   ```

### 解释
- **`pvresize`**：扩展物理卷以包含新的未分配空间。
- **`lvextend`**：扩展逻辑卷以使用新的物理卷空间。`-l +100%FREE` 表示使用所有可用的自由空间。
- **`resize2fs`**：扩展文件系统以使用新的逻辑卷空间。

到这里成功就完成了。
如果以上步骤未能扩展分区未能成功，物理卷sda3的大小未能扩展到新的磁盘大小
使用如下步骤：


### 使用 `fdisk`删除并重新创建 `sda3` 分区**
1. **备份重要数据**：
   - 在进行任何分区操作之前，建议备份重要数据，以防数据丢失。

2. **启动 `fdisk`**：
   ```sh
   sudo fdisk /dev/sda
   ```

3. **删除并重新创建 `sda3` 分区**：
   - 在 `fdisk` 提示符下，输入以下命令：
     - `p`：打印当前分区表，确认分区信息。
     - `d`：删除 `sda3` 分区（注意：这只是删除分区条目，不会删除实际数据）。
     - `n`：创建新分区。选择主分区（`p`），然后选择分区号（通常是 `3`），按回车接受默认的起始扇区，然后按回车接受默认的结束扇区以使用所有可用空间。
     - Do you want to remove the signature? [Y]es/[N]o: `N`
     - `w`：保存更改并退出 `fdisk`。

4. **重启虚拟机**：
   ```sh
   sudo reboot
   ```

5. **再次使用之前的一阶段的步骤即可**