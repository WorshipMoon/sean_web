# 同步 main 分支的更改到 feidalu 分支
param(
    [Parameter(Mandatory=$false)]
    [string]$commitMessage = "Sync changes from main"
)

# 错误处理
$ErrorActionPreference = "Stop"

try {
    Write-Host "开始同步分支..." -ForegroundColor Green

    # 保存当前分支名称
    $currentBranch = git rev-parse --abbrev-ref HEAD

    # 更新 main 分支
    Write-Host "更新 main 分支..." -ForegroundColor Yellow
    # git checkout main
    # git pull origin main

    # 获取最新的 commit hash
    $lastCommit = git rev-parse HEAD

    # 切换到 feidalu 分支
    Write-Host "切换到 feidalu 分支..." -ForegroundColor Yellow
    git checkout feidalu
    git pull origin feidalu

    # Cherry-pick 最新的更改
    Write-Host "应用 main 分支的更改..." -ForegroundColor Yellow
    git cherry-pick $lastCommit

    # 推送更改
    Write-Host "推送更改到远程..." -ForegroundColor Yellow
    git push origin feidalu

    # 切回原来的分支
    git checkout $currentBranch

    Write-Host "同步完成！" -ForegroundColor Green
} catch {
    Write-Host "发生错误: $_" -ForegroundColor Red
    
    # 如果发生错误，尝试恢复到初始状态
    if ($currentBranch) {
        Write-Host "正在恢复到原始分支..." -ForegroundColor Yellow
        git checkout $currentBranch
    }
    
    # 如果有 cherry-pick 冲突，中止它
    if (Test-Path ".git/CHERRY_PICK_HEAD") {
        git cherry-pick --abort
    }
    
    exit 1
} 