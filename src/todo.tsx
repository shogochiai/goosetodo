import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, CheckSquare, Square, ExternalLink, Settings, Clipboard, Home, AlertCircle, Plus, X, Edit, Save, FileText } from 'lucide-react';

// 設定画面コンポーネント
const SettingsView = ({ backgroundLinks, addBackgroundLink, updateBackgroundLink, deleteBackgroundLink, setCurrentView }) => (
  <div className="max-w-4xl mx-auto p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">設定</h2>
      <button
        onClick={() => setCurrentView('home')}
        className="text-gray-600 hover:text-gray-800"
      >
        <Home size={24} />
      </button>
    </div>
    
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">背景資料リンク</h3>
        <button
          onClick={addBackgroundLink}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
          data-testid="add-link-button"
        >
          <Plus size={20} />
          <span>リンクを追加</span>
        </button>
      </div>
      
      <div className="space-y-4">
        {backgroundLinks.map(link => (
          <div key={link.id} className="flex items-center space-x-2">
            <input
              type="text"
              value={link.name}
              onChange={(e) => updateBackgroundLink(link.id, 'name', e.target.value)}
              placeholder="リンク名"
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="link-name-input"
            />
            <input
              type="url"
              value={link.url}
              onChange={(e) => updateBackgroundLink(link.id, 'url', e.target.value)}
              placeholder="URL"
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="link-url-input"
            />
            <button
              onClick={() => deleteBackgroundLink(link.id)}
              className="text-red-600 hover:text-red-800"
            >
              <X size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// タスク詳細モーダルコンポーネント
const TaskDetailModal = ({ selectedTask, showTaskDetail, setShowTaskDetail, editingMemo, setEditingMemo, saveMemo, getCategoryColor }) => {
  if (!selectedTask || !showTaskDetail) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">タスク詳細</h3>
          <button
            onClick={() => setShowTaskDetail(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(selectedTask.category)}`}>
              {selectedTask.id}
            </span>
            <span className="text-sm text-gray-500">{selectedTask.phase}</span>
            <span className="text-sm text-gray-500">{selectedTask.date}</span>
          </div>
          <p className="text-lg text-gray-800">{selectedTask.content}</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">メモ</label>
          <textarea
            value={editingMemo}
            onChange={(e) => setEditingMemo(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="6"
            placeholder="このタスクに関するメモを入力してください..."
            data-testid="task-memo-textarea"
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={() => setShowTaskDetail(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            キャンセル
          </button>
          <button
            onClick={saveMemo}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <Save size={16} />
            <span>保存</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Overdueビューコンポーネント
const OverdueView = ({ overdueTasks, setCurrentView, toggleTaskComplete, getCategoryColor, openTaskDetail }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <AlertCircle className="text-red-500" size={24} />
            <h2 className="text-2xl font-bold">期限切れタスク</h2>
          </div>
          <button
            onClick={() => setCurrentView('home')}
            className="text-gray-600 hover:text-gray-800"
          >
            <Home size={24} />
          </button>
        </div>
        
        {overdueTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-8">期限切れのタスクはありません</p>
        ) : (
          <div className="space-y-3">
            {overdueTasks.map(task => (
              <div
                key={task.id}
                className="flex items-start space-x-3 p-4 rounded-lg border bg-red-50 border-red-200"
              >
                <button
                  onClick={() => toggleTaskComplete(task.id)}
                  className="mt-1 flex-shrink-0"
                >
                  <Square className="text-gray-400" size={24} />
                </button>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(task.category)}`}>
                      {task.id}
                    </span>
                    <span className="text-sm text-red-600 font-medium">{task.date}</span>
                  </div>
                  <p className="text-gray-800">{task.content}</p>
                </div>
                <button
                  onClick={() => openTaskDetail(task)}
                  className="text-gray-500 hover:text-gray-700"
                  data-testid="task-detail-button"
                >
                  <FileText size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ScheduleManager = () => {
  // 初期タスクデータ
  const initialTasks = [
    { id: 'A-01', date: '2025-07-01', content: 'ガチョウの品種、飼育方法、地域の関連法規に関する調査', category: 'A', phase: '計画・準備' },
    { id: 'B-01', date: '2025-07-01', content: 'RDSの公式ドキュメント（基準書、マニュアル）を精読', category: 'B', phase: '計画・準備' },
    { id: 'D-01', date: '2025-07-01', content: '収集すべきデータ項目（給餌量、体重、コスト等）の定義', category: 'D', phase: '計画・準備' },
    { id: 'A-02', date: '2025-07-02', content: '雛の入手先、飼料の調達先をリストアップし、連絡する', category: 'A', phase: '計画・準備' },
    { id: 'B-02', date: '2025-07-02', content: 'RDSの認証機関（CB）をリストアップする', category: 'B', phase: '計画・準備' },
    { id: 'D-02', date: '2025-07-02', content: 'データ収集用のスプレッドシート（または他のツール）を作成する', category: 'D', phase: '計画・準備' },
    { id: 'C-01', date: '2025-07-03', content: '「移動式竹柵」の設計図を作成する', category: 'C', phase: 'インフラ構築' },
    { id: 'B-03', date: '2025-07-03', content: '認証機関（CB）に連絡し、プロセス、費用、期間について問合せる', category: 'B', phase: 'インフラ構築' },
    { id: 'D-03', date: '2025-07-03', content: 'データ入力の運用ルール（入力タイミング、担当等）を定める', category: 'D', phase: 'インフラ構築' },
    { id: 'A-03', date: '2025-07-04', content: '飼育場所の選定と、小屋・給水所の最低限の設営', category: 'A', phase: 'インフラ構築' },
    { id: 'C-02', date: '2025-07-04', content: '竹柵の材料（竹、結束バンド、杭など）をリストアップし、調達する', category: 'C', phase: 'インフラ構築' },
    { id: 'B-04', date: '2025-07-04', content: '問い合わせ結果を基に、依頼する認証機関を決定する', category: 'B', phase: 'インフラ構築' },
    { id: 'A-04', date: '2025-07-07', content: '雛を数羽入手し、飼育を開始する', category: 'A', phase: '実行と構築' },
    { id: 'C-03', date: '2025-07-07', content: '移動式竹柵のプロトタイプを製作する', category: 'C', phase: '実行と構築' },
    { id: 'D-04', date: '2025-07-07', content: '初期の経費や活動記録など、実際のデータ入力を開始する', category: 'D', phase: '実行と構築' },
    { id: 'A-05', date: '2025-07-08', content: '雛の初期成長を観察し、日々のオペレーションを確立する', category: 'A', phase: '実行と改善' },
    { id: 'C-04', date: '2025-07-08', content: '製作した竹柵を飼育場所でテストし、問題点を洗い出す', category: 'C', phase: '実行と改善' },
    { id: 'B-05', date: '2025-07-08', content: '認証機関の要求に基づき、必要な書類準備を開始する', category: 'B', phase: '実行と改善' },
    { id: 'A-06', date: '2025-07-09', content: '成長後の加工・解体プロセスを調査し、手順書を作成する', category: 'A', phase: '最終準備' },
    { id: 'C-05', date: '2025-07-09', content: 'テスト結果を基に、竹柵の設計を改善し、最終版を製作する', category: 'C', phase: '最終準備' },
    { id: 'A-07', date: '2025-07-09', content: '加工に必要な道具（ナイフ、作業台等）を準備する', category: 'A', phase: '最終準備' },
  ];

  // デフォルトの背景資料リンク
  const defaultLinks = [
    { id: 1, name: 'スケーラブル自給自足モデル', url: 'https://hackmd.io/@ecdysisxyzbot-ea-001/B1GfA4cNll' },
    { id: 2, name: 'SSS: Self-sovereign Solarpunk', url: 'https://hackmd.io/@ecdysisxyzbot-ea-001/By0-GnXQlg' },
    { id: 3, name: 's/acc - 影の加速主義', url: 'https://hackmd.io/@ecdysisxyzbot-ea-001/HkgQWQLFQeg' },
  ];

  // State管理
  const [currentDate, setCurrentDate] = useState(() => {
    // 実際の環境では new Date() を使用
    return new Date('2025-07-01');
  });
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });
  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem('completedTasks');
    return saved ? JSON.parse(saved) : {};
  });
  const [taskMemos, setTaskMemos] = useState(() => {
    const saved = localStorage.getItem('taskMemos');
    return saved ? JSON.parse(saved) : {};
  });
  const [backgroundLinks, setBackgroundLinks] = useState(() => {
    const saved = localStorage.getItem('backgroundLinks');
    return saved ? JSON.parse(saved) : defaultLinks;
  });
  const [showSettings, setShowSettings] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({ content: '', category: 'A', phase: '追加タスク' });
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [editingMemo, setEditingMemo] = useState('');

  // LocalStorage save effects

  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  useEffect(() => {
    localStorage.setItem('backgroundLinks', JSON.stringify(backgroundLinks));
  }, [backgroundLinks]);

  useEffect(() => {
    localStorage.setItem('taskMemos', JSON.stringify(taskMemos));
  }, [taskMemos]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // 日付フォーマット
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDisplayDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    return date.toLocaleDateString('ja-JP', options);
  };

  // 現在の日付のタスクを取得
  const getCurrentDateTasks = () => {
    const dateStr = formatDate(currentDate);
    return tasks.filter(task => task.date === dateStr);
  };

  // Overdueタスクを取得
  const getOverdueTasks = () => {
    const today = formatDate(new Date('2025-07-01')); // 実際の環境では new Date() を使用
    return tasks.filter(task => 
      task.date < today && !completedTasks[task.id]
    );
  };

  // タスクの完了状態を切り替え
  const toggleTaskComplete = (taskId) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
  };

  // 日付ナビゲーション
  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + direction);
    setCurrentDate(newDate);
  };

  // カテゴリの色
  const getCategoryColor = (category) => {
    const colors = {
      A: 'bg-blue-100 text-blue-800 border-blue-300',
      B: 'bg-green-100 text-green-800 border-green-300',
      C: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      D: 'bg-purple-100 text-purple-800 border-purple-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // 進捗計算
  const calculateProgress = () => {
    const completedCount = Object.values(completedTasks).filter(Boolean).length;
    return {
      completed: completedCount,
      total: tasks.length,
      percentage: Math.round((completedCount / tasks.length) * 100)
    };
  };

  // Markdownエクスポート
  const exportToMarkdown = () => {
    const progress = calculateProgress();
    let markdown = `# スケーラブル自給自足モデル 進捗レポート\n\n`;
    markdown += `## 全体進捗: ${progress.completed}/${progress.total} (${progress.percentage}%)\n\n`;
    
    // 日付ごとにタスクをグループ化
    const tasksByDate = {};
    tasks.forEach(task => {
      if (!tasksByDate[task.date]) {
        tasksByDate[task.date] = [];
      }
      tasksByDate[task.date].push(task);
    });

    Object.entries(tasksByDate).sort().forEach(([date, dateTasks]) => {
      markdown += `### ${date}\n`;
      dateTasks.forEach(task => {
        const isCompleted = completedTasks[task.id];
        markdown += `- [${isCompleted ? 'x' : ' '}] **${task.id}**: ${task.content}\n`;
        if (taskMemos[task.id]) {
          markdown += `  - メモ: ${taskMemos[task.id]}\n`;
        }
      });
      markdown += '\n';
    });

    // クリップボードにコピー
    navigator.clipboard.writeText(markdown).then(() => {
      alert('進捗レポートをクリップボードにコピーしました！');
    });
  };

  // 新しいタスクを追加
  const addNewTask = () => {
    if (newTask.content.trim()) {
      const dateStr = formatDate(currentDate);
      const newId = `${newTask.category}-${tasks.filter(t => t.category === newTask.category).length + 1}`;
      const taskToAdd = {
        id: newId,
        date: dateStr,
        content: newTask.content,
        category: newTask.category,
        phase: newTask.phase
      };
      setTasks(prev => [...prev, taskToAdd]);
      setNewTask({ content: '', category: 'A', phase: '追加タスク' });
      setShowNewTaskForm(false);
    }
  };

  // 背景資料リンクを追加
  const addBackgroundLink = () => {
    const newLink = {
      id: `link-${Date.now()}-${Math.random()}`,
      name: '',
      url: ''
    };
    setBackgroundLinks(prev => [...prev, newLink]);
  };

  // 背景資料リンクを更新
  const updateBackgroundLink = (id, field, value) => {
    setBackgroundLinks(prev => prev.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  // 背景資料リンクを削除
  const deleteBackgroundLink = (id) => {
    setBackgroundLinks(prev => prev.filter(link => link.id !== id));
  };

  // タスク詳細を表示
  const openTaskDetail = (task) => {
    setSelectedTask(task);
    setEditingMemo(taskMemos[task.id] || '');
    setShowTaskDetail(true);
  };

  // メモを保存
  const saveMemo = () => {
    if (selectedTask) {
      setTaskMemos(prev => ({
        ...prev,
        [selectedTask.id]: editingMemo
      }));
      setShowTaskDetail(false);
    }
  };

  // ビューの切り替え
  if (currentView === 'settings') {
    return (
      <SettingsView 
        backgroundLinks={backgroundLinks}
        addBackgroundLink={addBackgroundLink}
        updateBackgroundLink={updateBackgroundLink}
        deleteBackgroundLink={deleteBackgroundLink}
        setCurrentView={setCurrentView}
      />
    );
  }
  
  if (currentView === 'overdue') {
    const overdueTasks = getOverdueTasks();
    return (
      <OverdueView 
        overdueTasks={overdueTasks}
        setCurrentView={setCurrentView}
        toggleTaskComplete={toggleTaskComplete}
        getCategoryColor={getCategoryColor}
        openTaskDetail={openTaskDetail}
      />
    );
  }

  const currentTasks = getCurrentDateTasks();
  const progress = calculateProgress();
  const overdueTasks = getOverdueTasks();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">スケーラブル自給自足モデル</h1>
            <nav className="flex items-center space-x-4">
              {backgroundLinks.filter(link => link.name && link.url).map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                >
                  <span>{link.name}</span>
                  <ExternalLink size={16} />
                </a>
              ))}
              <button
                onClick={() => setCurrentView('overdue')}
                className="relative text-gray-600 hover:text-gray-800"
              >
                <AlertCircle size={20} />
                {overdueTasks.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {overdueTasks.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setCurrentView('settings')}
                className="text-gray-600 hover:text-gray-800"
                data-testid="settings-button"
              >
                <Settings size={20} />
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 日付ナビゲーション */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigateDate(-1)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
                <Calendar size={20} />
                <span className="text-sm">スケジュール管理</span>
              </div>
              <h2 className="text-2xl font-bold">{formatDisplayDate(currentDate)}</h2>
            </div>
            <button
              onClick={() => navigateDate(1)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* 今日のタスクメッセージ */}
          {currentTasks.length > 0 && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
              <p className="text-lg mb-2">
                Sgさん、あなたは{formatDisplayDate(currentDate)}に以下のタスクを実行する必要があります：
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                {currentTasks.map(task => (
                  <li key={task.id} className="text-gray-700">
                    <span className="font-medium">{task.content}</span>
                    <span className="text-sm text-gray-500 ml-2">({task.id})</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* タスクリスト */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">本日のタスク</h3>
            <button
              onClick={() => setShowNewTaskForm(!showNewTaskForm)}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
              data-testid="add-task-button"
            >
              <Plus size={20} />
              <span>タスクを追加</span>
            </button>
          </div>

          {/* 新規タスク追加フォーム */}
          {showNewTaskForm && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-3">
                <input
                  type="text"
                  value={newTask.content}
                  onChange={(e) => setNewTask({ ...newTask, content: e.target.value })}
                  placeholder="タスクの内容を入力"
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-testid="task-input"
                />
                <div className="flex space-x-2">
                  <select
                    value={newTask.category}
                    onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                    className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="A">A - 飼育関連</option>
                    <option value="B">B - 認証関連</option>
                    <option value="C">C - 設備関連</option>
                    <option value="D">D - データ関連</option>
                  </select>
                  <input
                    type="text"
                    value={newTask.phase}
                    onChange={(e) => setNewTask({ ...newTask, phase: e.target.value })}
                    placeholder="フェーズ"
                    className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    data-testid="phase-input"
                  />
                  <button
                    onClick={addNewTask}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    追加
                  </button>
                  <button
                    onClick={() => setShowNewTaskForm(false)}
                    className="text-gray-600 hover:text-gray-800 px-4 py-2"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">本日のタスクはありません</p>
          ) : (
            <div className="space-y-3">
              {currentTasks.map(task => (
                <div
                  key={task.id}
                  className={`flex items-start space-x-3 p-4 rounded-lg border ${
                    completedTasks[task.id] ? 'bg-gray-50 opacity-75' : 'bg-white'
                  }`}
                >
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className="mt-1 flex-shrink-0"
                  >
                    {completedTasks[task.id] ? (
                      <CheckSquare className="text-green-600" size={24} />
                    ) : (
                      <Square className="text-gray-400" size={24} />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCategoryColor(task.category)}`}>
                        {task.id}
                      </span>
                      <span className="text-sm text-gray-500">{task.phase}</span>
                      {taskMemos[task.id] && (
                        <span className="text-xs text-blue-600">📝 メモあり</span>
                      )}
                    </div>
                    <p className={`text-gray-800 ${completedTasks[task.id] ? 'line-through' : ''}`}>
                      {task.content}
                    </p>
                  </div>
                  <button
                    onClick={() => openTaskDetail(task)}
                    className="text-gray-500 hover:text-gray-700"
                    data-testid="task-detail-button"
                  >
                    <FileText size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 進捗状況 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">全体進捗</h3>
            <button
              onClick={exportToMarkdown}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <Clipboard size={20} />
              <span>Markdownでコピー</span>
            </button>
          </div>
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">
                完了: {progress.completed} / {progress.total} タスク
              </span>
              <span className="text-sm font-medium">{progress.percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">開始日:</span>
              <span className="ml-2 font-medium">2025年7月1日</span>
            </div>
            <div>
              <span className="text-gray-600">完了予定:</span>
              <span className="ml-2 font-medium">2025年7月9日</span>
            </div>
          </div>
        </div>
      </main>

      {/* タスク詳細モーダル */}
      <TaskDetailModal 
        selectedTask={selectedTask}
        showTaskDetail={showTaskDetail}
        setShowTaskDetail={setShowTaskDetail}
        editingMemo={editingMemo}
        setEditingMemo={setEditingMemo}
        saveMemo={saveMemo}
        getCategoryColor={getCategoryColor}
      />
    </div>
  );
};

export default ScheduleManager;