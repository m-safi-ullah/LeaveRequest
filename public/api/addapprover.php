<?php
include 'DbConnect.php';

$dbConnection = new DbConnect();
$conn = $dbConnection->db();
if (!$conn) {
    die("Database connection failed");
}

$method = $_SERVER['REQUEST_METHOD'];
switch ($method) {
    case "POST":
        try {
            $sql = "INSERT INTO leaveapprover (approverName, approverEmail)
                    VALUES (:AppName, :AppEmail)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':AppName', $_POST['AppName']);
            $stmt->bindParam(':AppEmail', $_POST['AppEmail']);

            if ($stmt->execute()) {
                $response = ['status' => 1, 'message' => 'Successfully.'];
                echo json_encode($response);
            } else {
                $response = ['status' => 0, 'message' => 'Failed to create record.'];
                echo json_encode($response);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['status' => 0, 'message' => 'Error: ' . $e->getMessage()]);
        }
        break;
        case "GET":
            try {
                $sql = "SELECT * FROM leaveapprover";
                $stmt = $conn->prepare($sql);
        
                if ($stmt->execute()) {
                    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
                    $response = ['status' => 1, 'data' => $data];
                    echo json_encode($response);
                }
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['status' => 0, 'message' => 'Error: ' . $e->getMessage()]);
            }
            break;
        case "DELETE":
            $user = json_decode(file_get_contents('php://input'), true);
            try {
                $sql = "DELETE FROM leaveapprover WHERE approverID=:appID";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':appID', $user['appID']);
                if ($stmt->execute()) {
                    $response = ['status' => 1, 'message' => 'Record deleted successfully.'];
                    echo json_encode($response);
                }
            } catch (PDOException $e) {
                http_response_code(500);
                echo json_encode(['status' => 0, 'message' => 'Error: ' . $e->getMessage()]);
            }
            break;
        
}
?>
