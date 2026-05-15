#include <iostream>
#include <vector>
using namespace std;

int redCellCount = 0, blueCellCount = 0;
int redScore = 0, blueScore = 0;
int turn = 0;
int readTime = 2, blueTime = 2, gameTime = 3;

pair<int,int> getInput()
{
    int row, column;
    cin >> row >> column;
    while(row < 0 || row > 11 || column < 0 || column > 5)
    {
        cout << "Invalid input. Please enter row (0-11) and column (0-5)." << endl;
        cin >> row >> column;
    } 
    return make_pair(row, column);
}

void printBoard(const vector<vector<pair<int, int>>> &board)
{
    cout << "Current Board State:" << endl;
    for (const auto &row : board)
    {
        for (const auto &cell : row)
        {
            if (cell.first == 0)
            {
                cout << ".  ";
            }
            else if (cell.first == 1)
            {
                cout << "B" << cell.second << " ";
            }
            else if (cell.first == 2)
            {
                cout << "R" << cell.second << " ";
            }
        }
        cout << endl;
    }
}

int gameOver()
{
    if (turn == 0 && redCellCount == 0)
    {
        cout<<"Blue wins!"<<endl;
        cout << "Red Score: " << redScore << " | Blue Score: " << blueScore << endl;
        return 1;
    }
    else if (turn == 1 && blueCellCount == 0)
    {
        cout<<"Red wins!"<<endl;
        cout << "Red Score: " << redScore << " | Blue Score: " << blueScore << endl;
        return 1;
    }
    return 0;
}

bool cornerCell(int row, int col)
{
    return (row == 0 && col == 0) || (row == 0 && col == 5) || (row == 11 && col == 0) || (row == 11 && col == 5);
}
bool edgeCell(int row, int col)
{
    return (row == 0 && col >= 1 && col <= 4) || (row == 11 && col >= 1 && col <= 4) || (row >= 1 && row <= 10 && col == 0) || (row >= 1 && row <= 10 && col == 5);
}
bool innerCell(int row, int col)
{
    return !cornerCell(row, col) && !edgeCell(row, col);
}

bool capacityFull(int row, int col, vector<vector<pair<int, int>>> &board)
{
    if (cornerCell(row, col) && board[row][col].second == 2)
    {
        return true;
    }
    else if (edgeCell(row, col) && board[row][col].second == 3)
    {
        return true;
    }
    else if (innerCell(row, col) && board[row][col].second == 4)
    {
        return true;
    }
    return false;
}

void intitialiseBalls(int row, int col, vector<vector<pair<int, int>>> &board)
{
    if (cornerCell(row, col))
    {
        // Corner
        board[row][col].second = 1;
    }
    else if (edgeCell(row, col))
    {
        // Edge
        board[row][col].second = 2;
    }
    else
    {
        // Inner
        board[row][col].second = 3;
    }
}

void updateCell(int row, int col, int colorOfCell, vector<vector<pair<int, int>>> &board)
{
    if(board[row][col].first == 0){
            board[row][col].first = colorOfCell;
            if (colorOfCell == 1)
            {
                redCellCount++;
                redScore++;
            }
            else if (colorOfCell == 2)
            {
                blueCellCount++;
                blueScore++;
            }
        }
        else if (board[row][col].first !=colorOfCell)
        {
            board[row][col].first = colorOfCell;
            if (colorOfCell == 1)
            {
                redCellCount++;
                blueCellCount--;
                redScore++;
            }
            else if (colorOfCell == 2)
            {
                blueCellCount++;
                redCellCount--;
                blueScore++;
            }
        }
}

void chainReaction(int row, int col, vector<vector<pair<int, int>>> &board)
{
    if (!capacityFull(row, col, board))return;
    int colorOfCell=board[row][col].first;

    if (colorOfCell == 1)redCellCount--;
    else if (colorOfCell == 2)blueCellCount--;

    board[row][col].first = 0;
    board[row][col].second = 0;

    int upRow = row - 1, downRow = row + 1, leftCol = col - 1, rightCol = col + 1;

    if (upRow >= 0)// up-cell
    { 
        updateCell(upRow, col, colorOfCell, board);
        board[upRow][col].second++;
        chainReaction(upRow, col, board);
        
    }
    
    if (downRow <= 11)// down-cell
    {
        updateCell(downRow, col,colorOfCell,board);
        board[downRow][col].second++;
        chainReaction(downRow, col, board);
    }
    
    if (leftCol >= 0)// left-cell
    {
        updateCell(row, leftCol, colorOfCell, board);
        board[row][leftCol].second++;
        chainReaction(row, leftCol, board);
    }

    if (rightCol <= 5)// right-cell
    {
        updateCell(row, rightCol, colorOfCell, board);
        board[row][rightCol].second++;
        chainReaction(row, rightCol, board);
    }
}

void redFirstTurn(vector<vector<pair<int, int>>> &board)
{
    int row, column;
    cout << "Red choose a cell for first turn:";
    tie(row, column) = getInput();
    board[row][column].first = 1;
    intitialiseBalls(row, column, board);
    redCellCount++;
    redScore += board[row][column].second;
}


void blueFirstTurn(vector<vector<pair<int, int>>> &board)
{
    int row, column;
    cout << "Blue choose a cell for first turn:";
    tie(row, column) = getInput();
    while (board[row][column].first == 1)
    {
        cout << "Cell already occupied by red. Please choose another empty cell." << endl;
        tie(row, column) = getInput();
    }
    board[row][column].first = 2;
    intitialiseBalls(row, column, board);
    blueCellCount++;
    blueScore += board[row][column].second;
}

void redTurn(vector<vector<pair<int, int>>> &board)
{
    int row, column;
    cout << "Red choose a cell:";
    tie(row, column) = getInput();
    while (board[row][column].first == 2 || board[row][column].first == 0)
    {
        cout << "Please choose another cell with red." << endl;
        cin >> row >> column;
    }
    board[row][column].second++;
    redScore++;
    chainReaction(row, column, board);
}

void blueTurn(vector<vector<pair<int, int>>> &board)
{
    int row, column;
    cout << "Blue choose a cell:";
    tie(row, column) = getInput();
    // middle of the game
    while (board[row][column].first == 1 || board[row][column].first == 0)
    {
        cout << "Please choose another cell with blue." << endl;
        tie(row, column) = getInput();
    }
    board[row][column].second++;
    blueScore++;
    chainReaction(row, column, board);
}

int main()
{
    vector<vector<pair<int, int>>> board(12, vector<pair<int, int>>(6, make_pair(0, 0)));

    cout << "Welcome to Chain Reactor!" << endl;
    redFirstTurn(board);
    printBoard(board);
    blueFirstTurn(board);
    printBoard(board);
    while (!gameOver())
    {
        if (turn == 0)
        {
            redTurn(board);
            turn = 1;
        }
        else
        {
            blueTurn(board);
            turn = 0;
        }
        printBoard(board);
        cout << "Red Score: " << redScore << " | Blue Score: " << blueScore << endl;
        cout << "Red Cells: " << redCellCount << " | Blue Cells: " << blueCellCount << endl;
    }
    printBoard(board);

}